param(
  [int]$BatchIndex = 1,
  [int]$BatchSize = 10,
  [string[]]$ProvinceSlugs = @(),
  [int]$TargetGallery = 3,
  [int]$WebpQuality = 82,
  [int]$RequestDelayMs = 900,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

function Invoke-WithRetry {
  param(
    [scriptblock]$Action,
    [int]$MaxAttempts = 4,
    [int]$InitialDelaySeconds = 2
  )

  $attempt = 1
  $delay = $InitialDelaySeconds
  while ($true) {
    try {
      return & $Action
    } catch {
      if ($attempt -ge $MaxAttempts) { throw }
      Start-Sleep -Seconds $delay
      $attempt += 1
      $delay = [Math]::Min($delay * 2, 20)
    }
  }
}

function Resolve-Cwebp {
  $cmd = Get-Command cwebp -ErrorAction SilentlyContinue
  if ($cmd) {
    if ($cmd.Path) { return $cmd.Path }
    if ($cmd.Source) { return $cmd.Source }
  }

  # WinGet fallback is Windows-only; LOCALAPPDATA is unset on Linux runners.
  if ($env:LOCALAPPDATA) {
    $wingetPackages = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages'
    $found = Get-ChildItem $wingetPackages -Recurse -Filter cwebp.exe -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
      return $found.FullName
    }
  }

  throw 'cwebp was not found. Install the WebP command-line tools before running curation.'
}

function Convert-ToWebp {
  param(
    [string]$Cwebp,
    [string]$InputPath,
    [string]$OutputPath,
    [int]$Quality = 82
  )

  $null = New-Item -ItemType Directory -Force -Path (Split-Path -Parent $OutputPath)
  & $Cwebp -quiet -q $Quality -resize 1600 0 $InputPath -o $OutputPath
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path $OutputPath)) {
    throw "Failed converting to WebP: $InputPath"
  }
}

function Resolve-WikimediaProvinceName {
  param([string]$Province)

  $aliases = @{
    'Buri Ram' = 'Buriram'
    'Chai Nat' = 'Chainat'
    'Lop Buri' = 'Lopburi'
    'Nong Bua Lamphu' = 'Nongbua Lamphu'
    'Prachin Buri' = 'Prachinburi'
    'Si Sa Ket' = 'Sisaket'
  }

  if ($aliases.ContainsKey($Province)) {
    return $aliases[$Province]
  }
  return $Province
}

function Get-ProvinceCategoryCandidates {
  param([string]$Province)

  $name = (Resolve-WikimediaProvinceName -Province $Province).Trim()
  $escaped = $name -replace ' ', '_'
  return @(
    "Category:Tourism_in_${escaped}_Province",
    "Category:Attractions_in_${escaped}_Province",
    "Category:${escaped}_Province",
    "Category:${escaped}"
  )
}

function New-CandidateObject {
  param(
    [string]$Title,
    [string]$Caption,
    [string]$Credit,
    [string]$Source,
    [string]$DownloadUrl
  )

  [pscustomobject]@{
    title = $Title
    caption = $Caption
    credit = $Credit
    source = $Source
    downloadUrl = $DownloadUrl
  }
}

function Get-CommonsFilesFromCategory {
  param([string]$CategoryTitle)

  $api = 'https://commons.wikimedia.org/w/api.php'
  $query = @{
    action = 'query'
    format = 'json'
    generator = 'categorymembers'
    gcmtitle = $CategoryTitle
    gcmtype = 'file'
    gcmlimit = '80'
    prop = 'imageinfo'
    iiprop = 'url|user|extmetadata|mime|size'
    iiurlwidth = '1800'
  }

  $uri = $api + '?' + (($query.GetEnumerator() | ForEach-Object { "{0}={1}" -f $_.Key, [uri]::EscapeDataString($_.Value) }) -join '&')

  $response = Invoke-WithRetry -Action {
    Invoke-RestMethod -Method Get -Uri $uri -Headers @{ 'User-Agent' = 'ThaiTourismGalleryCurator/1.0 (https://github.com/armddzzpluto-ops/thai-tourism)' }
  }

  if (-not $response.query.pages) {
    return @()
  }

  $pages = $response.query.pages.PSObject.Properties | ForEach-Object { $_.Value }
  $out = @()

  foreach ($page in $pages) {
    $info = $page.imageinfo | Select-Object -First 1
    if (-not $info) { continue }

    $mime = [string]$info.mime
    if (-not $mime.StartsWith('image/')) { continue }
    if ($mime -match 'svg|tiff|gif|webp') { continue }

    $title = [string]$page.title
    if ($title -match '(?i)map|flag|coat of arms|emblem|logo|seal|locator|diagram|administrative|district map') { continue }

    $caption = [string]$info.extmetadata.ImageDescription.value
    if (-not $caption) { $caption = $title }

    $credit = [string]$info.extmetadata.Artist.value
    if (-not $credit) { $credit = [string]$info.user }
    if (-not $credit) { $credit = 'Wikimedia Commons contributor' }

    $source = [string]$info.descriptionurl
    if (-not $source) { $source = [string]$info.url }

    $downloadUrl = [string]$info.url
    if (-not $downloadUrl) { $downloadUrl = [string]$info.thumburl }
    if (-not $downloadUrl) { continue }

    $out += (New-CandidateObject -Title $title -Caption $caption -Credit $credit -Source $source -DownloadUrl $downloadUrl)
  }

  return $out
}

function Get-WikipediaImageCandidates {
  param([string]$Province)

  $wikimediaProvince = Resolve-WikimediaProvinceName -Province $Province
  $pageCandidates = @(
    "${wikimediaProvince} Province",
    "$wikimediaProvince",
    "${Province} Province",
    "$Province"
  )

  $result = @()
  foreach ($pageTitle in $pageCandidates) {
    try {
      $api = 'https://en.wikipedia.org/w/api.php'
      $query = @{
        action = 'query'
        format = 'json'
        prop = 'images'
        titles = $pageTitle
        imlimit = '80'
      }
      $uri = $api + '?' + (($query.GetEnumerator() | ForEach-Object { "{0}={1}" -f $_.Key, [uri]::EscapeDataString($_.Value) }) -join '&')
      $response = Invoke-WithRetry -Action {
        Invoke-RestMethod -Method Get -Uri $uri -Headers @{ 'User-Agent' = 'ThaiTourismGalleryCurator/1.0 (https://github.com/armddzzpluto-ops/thai-tourism)' }
      }

      $pages = $response.query.pages.PSObject.Properties | ForEach-Object { $_.Value }
      $images = @($pages.images)
      foreach ($img in $images) {
        if (-not $img.title) { continue }
        if ($img.title -match '(?i)map|flag|coat of arms|emblem|logo|seal|locator|diagram') { continue }

        $commonsQuery = @{
          action = 'query'
          format = 'json'
          titles = $img.title
          prop = 'imageinfo'
          iiprop = 'url|user|extmetadata|mime|size'
          iiurlwidth = '1800'
        }
        $commonsApi = 'https://commons.wikimedia.org/w/api.php?' + (($commonsQuery.GetEnumerator() | ForEach-Object { "{0}={1}" -f $_.Key, [uri]::EscapeDataString($_.Value) }) -join '&')
        $commonsRes = Invoke-WithRetry -Action {
          Invoke-RestMethod -Method Get -Uri $commonsApi -Headers @{ 'User-Agent' = 'ThaiTourismGalleryCurator/1.0 (https://github.com/armddzzpluto-ops/thai-tourism)' }
        }
        $commonsPages = $commonsRes.query.pages.PSObject.Properties | ForEach-Object { $_.Value }
        foreach ($cp in $commonsPages) {
          $info = $cp.imageinfo | Select-Object -First 1
          if (-not $info) { continue }
          $mime = [string]$info.mime
          if (-not $mime.StartsWith('image/')) { continue }
          if ($mime -match 'svg|tiff|gif|webp') { continue }

          $caption = [string]$info.extmetadata.ImageDescription.value
          if (-not $caption) { $caption = [string]$img.title }
          $credit = [string]$info.extmetadata.Artist.value
          if (-not $credit) { $credit = [string]$info.user }
          if (-not $credit) { $credit = 'Wikimedia Commons contributor' }
          $source = [string]$info.descriptionurl
          if (-not $source) { $source = [string]$info.url }
          $downloadUrl = [string]$info.url
          if (-not $downloadUrl) { $downloadUrl = [string]$info.thumburl }
          if (-not $downloadUrl) { continue }

          $result += (New-CandidateObject -Title ([string]$img.title) -Caption $caption -Credit $credit -Source $source -DownloadUrl $downloadUrl)
        }
      }

      if ($result.Count -gt 0) {
        return $result
      }
    } catch {
      continue
    }
  }

  return $result
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

$manifestPath = Join-Path $repoRoot 'assets/images/provinces/manifest.json'
$validationPath = Join-Path $repoRoot 'assets/images/provinces/validation-report.json'

if (-not (Test-Path $manifestPath)) {
  throw "Missing manifest: $manifestPath"
}

$cwebp = Resolve-Cwebp
$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
$validation = if (Test-Path $validationPath) { Get-Content $validationPath -Raw | ConvertFrom-Json } else { @() }

if ($ProvinceSlugs -and $ProvinceSlugs.Count -gt 0) {
  $manifestBySlug = @{}
  foreach ($entry in $manifest) {
    $manifestBySlug[[string]$entry.slug] = $entry
  }

  $missingSlugs = @()
  $batch = @()
  foreach ($slug in $ProvinceSlugs) {
    $normalizedSlug = ([string]$slug).Trim().ToLowerInvariant()
    if (-not $normalizedSlug) { continue }

    if ($manifestBySlug.ContainsKey($normalizedSlug)) {
      $batch += $manifestBySlug[$normalizedSlug]
    } else {
      $missingSlugs += $normalizedSlug
    }
  }

  if ($missingSlugs.Count -gt 0) {
    throw "Unknown province slug(s): $($missingSlugs -join ', ')"
  }
} else {
  $start = ($BatchIndex - 1) * $BatchSize
  $batch = @($manifest | Select-Object -Skip $start -First $BatchSize)
  if (-not $batch.Count) {
    throw "No provinces found for batch index $BatchIndex"
  }
}

$batchReport = @()

foreach ($provinceMeta in $batch) {
  $province = [string]$provinceMeta.province
  $slug = [string]$provinceMeta.slug
  $heroImage = [string]$provinceMeta.heroImage

  # Resume safely: do not download a province again after a verified batch commit.
  $existingValidation = @($validation | Where-Object { [string]$_.slug -eq $slug }) | Select-Object -First 1
  if ($existingValidation -and
      [string]$existingValidation.status -eq 'complete' -and
      [int]$existingValidation.fallbackCount -eq 0 -and
      [int]$existingValidation.galleryCount -ge $TargetGallery) {
    $batchReport += [pscustomobject]@{
      province = $province
      slug = $slug
      status = 'curated'
      curatedCount = [int]$existingValidation.galleryCount
    }
    continue
  }

  $heroAttribution = @($provinceMeta.attribution | Where-Object { $_.role -eq 'hero' }) | Select-Object -First 1
  $heroSource = if ($heroAttribution) { [string]$heroAttribution.imageSource } else { '' }

  $provinceDir = Join-Path $repoRoot ("assets/images/provinces/$slug")
  $heroPath = Join-Path $repoRoot $heroImage

  if (-not (Test-Path $heroPath)) {
    $batchReport += [pscustomobject]@{ province = $province; slug = $slug; status = 'hero-missing'; curatedCount = 0 }
    continue
  }

  $candidatePool = @()
  foreach ($category in (Get-ProvinceCategoryCandidates -Province $province)) {
    try {
      $candidatePool += Get-CommonsFilesFromCategory -CategoryTitle $category
      Start-Sleep -Milliseconds $RequestDelayMs
    } catch {
      continue
    }
  }

  if ($candidatePool.Count -lt $TargetGallery) {
    try {
      $candidatePool += Get-WikipediaImageCandidates -Province $province
    } catch {
      # ignore and continue with what we have
    }
  }

  $picked = @()
  $seen = @{}

  foreach ($candidate in $candidatePool) {
    if ($picked.Count -ge ($TargetGallery * 4)) { break }

    $key = ([string]$candidate.title).ToLowerInvariant()
    if (-not $key) { continue }
    if ($seen.ContainsKey($key)) { continue }

    # Do not reuse hero source/title for gallery items.
    if ($heroSource -and ([string]$candidate.source -eq $heroSource)) { continue }

    $seen[$key] = $true
    $picked += $candidate
  }

  if ($picked.Count -lt $TargetGallery) {
    $batchReport += [pscustomobject]@{
      province = $province
      slug = $slug
      status = 'insufficient-unique-candidates'
      curatedCount = $picked.Count
    }
    continue
  }

  $newGalleryPaths = @()
  $newAttribution = @()

  foreach ($candidate in $picked) {
    if ($newGalleryPaths.Count -ge $TargetGallery) { break }

    $idx = $newGalleryPaths.Count + 1
    $galleryRel = "assets/images/provinces/$slug/gallery-$idx.webp"
    $galleryPath = Join-Path $provinceDir "gallery-$idx.webp"
    $tempRoot = [System.IO.Path]::GetTempPath()
    $tempPath = Join-Path $tempRoot ("curate-{0}-{1}-{2}.img" -f $slug, $idx, [guid]::NewGuid().ToString('N'))

    try {
      if (-not $DryRun) {
        Invoke-WithRetry -MaxAttempts 2 -InitialDelaySeconds 1 -Action {
          Invoke-WebRequest -Uri $candidate.downloadUrl -OutFile $tempPath -TimeoutSec 20 -Headers @{ 'User-Agent' = 'ThaiTourismGalleryCurator/1.0 (https://github.com/armddzzpluto-ops/thai-tourism)' }
        } | Out-Null
        Start-Sleep -Milliseconds $RequestDelayMs
        Convert-ToWebp -Cwebp $cwebp -InputPath $tempPath -OutputPath $galleryPath -Quality $WebpQuality
      }

      $newGalleryPaths += $galleryRel
      $newAttribution += [ordered]@{
        province = $province
        slug = $slug
        role = "gallery-$idx"
        file = $galleryRel
        caption = [string]$candidate.caption
        photoCredit = [string]$candidate.credit
        imageSource = [string]$candidate.source
        isFallback = $false
      }
    } catch {
      # A single corrupt or unsupported Commons file must not fail the province.
      if (Test-Path $galleryPath) {
        Remove-Item $galleryPath -Force -ErrorAction SilentlyContinue
      }
    } finally {
      if (Test-Path $tempPath) {
        Remove-Item $tempPath -Force -ErrorAction SilentlyContinue
      }
    }
  }

  if ($newGalleryPaths.Count -lt $TargetGallery) {
    foreach ($partialPath in $newGalleryPaths) {
      $absolutePartial = Join-Path $repoRoot $partialPath
      if (Test-Path $absolutePartial) {
        Remove-Item $absolutePartial -Force -ErrorAction SilentlyContinue
      }
    }
    $batchReport += [pscustomobject]@{
      province = $province
      slug = $slug
      status = 'insufficient-convertible-candidates'
      curatedCount = $newGalleryPaths.Count
    }
    continue
  }

  $provinceMeta.galleryImages = $newGalleryPaths

  $heroRecord = if ($heroAttribution) {
    [ordered]@{
      province = $province
      slug = $slug
      role = 'hero'
      file = [string]$heroAttribution.file
      caption = [string]$heroAttribution.caption
      photoCredit = [string]$heroAttribution.photoCredit
      imageSource = [string]$heroAttribution.imageSource
      isFallback = $false
    }
  } else {
    [ordered]@{
      province = $province
      slug = $slug
      role = 'hero'
      file = "assets/images/provinces/$slug/hero.webp"
      caption = "$province tourism hero"
      photoCredit = 'Wikimedia Commons contributor'
      imageSource = $heroSource
      isFallback = $false
    }
  }

  $provinceMeta.attribution = @($heroRecord) + $newAttribution

  if (-not $DryRun) {
    $metaPath = Join-Path $provinceDir 'metadata.json'
    $provinceMeta | ConvertTo-Json -Depth 10 | Set-Content -Path $metaPath -Encoding UTF8
  }

  $batchReport += [pscustomobject]@{
    province = $province
    slug = $slug
    status = 'curated'
    curatedCount = $newGalleryPaths.Count
  }

  # Keep requests paced to reduce 429.
  Start-Sleep -Milliseconds $RequestDelayMs
}

# Update aggregate files.
if (-not $DryRun) {
  $manifest | ConvertTo-Json -Depth 10 | Set-Content -Path $manifestPath -Encoding UTF8

  $validationMap = @{}
  foreach ($row in $validation) {
    $validationMap[[string]$row.slug] = $row
  }

  foreach ($row in $batchReport) {
    if ($validationMap.ContainsKey($row.slug)) {
      $item = $validationMap[$row.slug]
      if ($row.status -eq 'curated') {
        $item.status = 'complete'
        $item.galleryCount = $row.curatedCount
        $item.fallbackCount = 0
      } else {
        $item.status = $row.status
      }
    }
  }

  $updatedValidation = @($validationMap.Values | Sort-Object slug)
  $updatedValidation | ConvertTo-Json -Depth 8 | Set-Content -Path $validationPath -Encoding UTF8
}

$summary = [ordered]@{
  batchIndex = $BatchIndex
  batchSize = $BatchSize
  provincesInBatch = $batch.Count
  curated = (@($batchReport | Where-Object { $_.status -eq 'curated' })).Count
  pending = (@($batchReport | Where-Object { $_.status -ne 'curated' })).Count
  details = $batchReport
}

$summary | ConvertTo-Json -Depth 8 | Write-Output
