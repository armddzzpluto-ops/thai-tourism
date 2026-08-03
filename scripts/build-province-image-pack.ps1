param(
  [int]$MinGallery = 5,
  [int]$MaxGallery = 8,
  [int]$WebpQuality = 82,
  [switch]$SkipRemote,
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

function ConvertTo-Slug {
  param([string]$Value)

  return ($Value.ToLowerInvariant() -replace '[^a-z0-9]+', '-' -replace '^-+|-+$', '')
}

function Resolve-Cwebp {
  $cmd = Get-Command cwebp -ErrorAction SilentlyContinue
  if ($cmd) {
    return $cmd.Source
  }

  $wingetPackages = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages'
  if (Test-Path $wingetPackages) {
    $found = Get-ChildItem $wingetPackages -Recurse -Filter cwebp.exe -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
      return $found.FullName
    }
  }

  throw 'cwebp.exe not found. Install Google.Libwebp first (winget install Google.Libwebp).'
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

function New-Attribution {
  param(
    [string]$Province,
    [string]$Slug,
    [string]$Role,
    [string]$File,
    [string]$Caption,
    [string]$AttributionText,
    [string]$Source,
    [bool]$IsFallback
  )

  return [ordered]@{
    province = $Province
    slug = $Slug
    role = $Role
    file = $File
    caption = $Caption
    photoCredit = $AttributionText
    imageSource = $Source
    isFallback = $IsFallback
  }
}

function Get-ProvinceCategoryCandidates {
  param([string]$Province)

  $name = $Province.Trim()
  $escaped = $name -replace ' ', '_'
  return @(
    "Category:${escaped}_Province",
    "Category:Tourism_in_${escaped}_Province",
    "Category:${escaped}",
    "Category:Attractions_in_${escaped}_Province"
  )
}

function Get-CommonsFilesFromCategory {
  param(
    [string]$CategoryTitle
  )

  $api = 'https://commons.wikimedia.org/w/api.php'
  $query = @{
    action = 'query'
    format = 'json'
    generator = 'categorymembers'
    gcmtitle = $CategoryTitle
    gcmtype = 'file'
    gcmlimit = '40'
    prop = 'imageinfo'
    iiprop = 'url|user|extmetadata|mime|size'
    iiurlwidth = '1800'
  }

  $uri = $api + '?' + (($query.GetEnumerator() | ForEach-Object { "{0}={1}" -f $_.Key, [uri]::EscapeDataString($_.Value) }) -join '&')
  $response = Invoke-WithRetry -Action {
    Invoke-RestMethod -Method Get -Uri $uri -Headers @{ 'User-Agent' = 'ThailandTravelGuideImagePack/1.0' }
  }

  if (-not $response.query.pages) {
    return @()
  }

  $pages = $response.query.pages.PSObject.Properties | ForEach-Object { $_.Value }
  $files = @()

  foreach ($page in $pages) {
    $info = $page.imageinfo | Select-Object -First 1
    if (-not $info) { continue }
    $mime = [string]$info.mime
    if (-not $mime.StartsWith('image/')) { continue }
    if ($mime -match 'svg|tiff') { continue }

    $title = [string]$page.title
    if ($title -match '(?i)map|flag|coat of arms|emblem|logo|seal|locator|diagram|administrative') { continue }

    $caption = [string]$info.extmetadata.ImageDescription.value
    if (-not $caption) { $caption = $title }

    $credit = [string]$info.extmetadata.Artist.value
    if (-not $credit) { $credit = [string]$info.user }
    if (-not $credit) { $credit = 'Wikimedia Commons contributor' }

    $source = [string]$info.descriptionurl
    if (-not $source) { $source = [string]$info.url }

    $downloadUrl = [string]$info.thumburl
    if (-not $downloadUrl) { $downloadUrl = [string]$info.url }
    if (-not $downloadUrl) { continue }

    $files += [ordered]@{
      title = $title
      caption = $caption
      credit = $credit
      source = $source
      downloadUrl = $downloadUrl
    }
  }

  return $files
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

$sourcesPath = Join-Path $repoRoot 'assets\images\provinces\sources.json'
if (-not (Test-Path $sourcesPath)) {
  throw "Missing sources file: $sourcesPath"
}

$cwebp = Resolve-Cwebp
$sources = Get-Content $sourcesPath -Raw | ConvertFrom-Json

$sourceSlugSet = @{}
foreach ($entry in $sources) {
  if ($entry.localPath) {
    $sourceSlug = [System.IO.Path]::GetFileNameWithoutExtension([string]$entry.localPath)
    $sourceSlugSet[$sourceSlug] = $true
  }
}

$jpgFiles = Get-ChildItem (Join-Path $repoRoot 'assets\\images\\provinces') -Filter '*.jpg' -File
foreach ($jpg in $jpgFiles) {
  $slug = $jpg.BaseName
  if (-not $sourceSlugSet.ContainsKey($slug)) {
    $provinceName = (($slug -split '-') | ForEach-Object {
      if ($_.Length -gt 0) {
        $_.Substring(0, 1).ToUpperInvariant() + $_.Substring(1)
      }
    }) -join ' '

    $sources += [pscustomobject]@{
      province = $provinceName
      wikidataLabel = $provinceName
      imageUrl = $null
      localPath = "assets/images/provinces/$slug.jpg"
      retrievedAtUtc = (Get-Date).ToUniversalTime().ToString('o')
      source = 'local-fallback'
    }
    $sourceSlugSet[$slug] = $true
  }
}

$baseDir = Join-Path $repoRoot 'assets\images\provinces'
$manifest = @()
$validation = @()

foreach ($entry in $sources) {
  $province = [string]$entry.province
  $slug = if ($entry.localPath) {
    [System.IO.Path]::GetFileNameWithoutExtension([string]$entry.localPath)
  } else {
    ConvertTo-Slug $province
  }
  try {
    $jpgPath = Join-Path $repoRoot ([string]$entry.localPath -replace '/', '\\')
    if (-not (Test-Path $jpgPath)) {
      $validation += [ordered]@{ province = $province; slug = $slug; status = 'missing-source-jpg'; galleryCount = 0 }
      continue
    }

    $provinceDir = Join-Path $baseDir $slug
    $heroPath = Join-Path $provinceDir 'hero.webp'

    if (-not $DryRun) {
      Convert-ToWebp -Cwebp $cwebp -InputPath $jpgPath -OutputPath $heroPath -Quality $WebpQuality
    }

    $provinceManifest = [ordered]@{
      province = $province
      slug = $slug
      heroImage = "assets/images/provinces/$slug/hero.webp"
      galleryImages = @()
      attribution = @()
    }

    $heroSource = if ($entry.imageUrl) { [string]$entry.imageUrl } else { [string]$entry.source }
    $provinceManifest.attribution += (New-Attribution -Province $province -Slug $slug -Role 'hero' -File $provinceManifest.heroImage -Caption "$province tourism highlight" -AttributionText 'Wikimedia Commons contributor' -Source $heroSource -IsFallback:$false)

    $downloadedCount = 0
    $usedKeys = @{}

    if (-not $SkipRemote) {
      $remoteCandidates = @()
      foreach ($category in (Get-ProvinceCategoryCandidates -Province $province)) {
        try {
          $remoteCandidates += Get-CommonsFilesFromCategory -CategoryTitle $category
        } catch {
          continue
        }
      }

      foreach ($candidate in $remoteCandidates) {
        if ($downloadedCount -ge $MaxGallery) { break }

        $key = [string]$candidate.title
        if ($usedKeys.ContainsKey($key)) { continue }
        $usedKeys[$key] = $true

        $idx = $downloadedCount + 1
        $galleryWebpRel = "assets/images/provinces/$slug/gallery-$idx.webp"
        $galleryWebpPath = Join-Path $provinceDir "gallery-$idx.webp"
        $tempFile = Join-Path $env:TEMP ("{0}-{1}-{2}.jpg" -f $slug, $idx, [guid]::NewGuid().ToString('N'))

        try {
          if (-not $DryRun) {
            Invoke-WithRetry -Action {
              Invoke-WebRequest -Uri $candidate.downloadUrl -OutFile $tempFile -Headers @{ 'User-Agent' = 'ThailandTravelGuideImagePack/1.0' }
            } | Out-Null
            Convert-ToWebp -Cwebp $cwebp -InputPath $tempFile -OutputPath $galleryWebpPath -Quality $WebpQuality
          }

          $provinceManifest.galleryImages += $galleryWebpRel
          $provinceManifest.attribution += (New-Attribution -Province $province -Slug $slug -Role "gallery-$idx" -File $galleryWebpRel -Caption ([string]$candidate.caption) -AttributionText ([string]$candidate.credit) -Source ([string]$candidate.source) -IsFallback:$false)
          $downloadedCount += 1
        } catch {
          # Skip unusable remote files and continue.
        } finally {
          if (Test-Path $tempFile) {
            Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
          }
        }
      }
    }

    # Ensure at least MinGallery files exist to avoid broken links in UI.
    while ($downloadedCount -lt $MinGallery) {
      $idx = $downloadedCount + 1
      $galleryWebpRel = "assets/images/provinces/$slug/gallery-$idx.webp"
      $galleryWebpPath = Join-Path $provinceDir "gallery-$idx.webp"

      if (-not $DryRun) {
        Copy-Item -Path $heroPath -Destination $galleryWebpPath -Force
      }

      $provinceManifest.galleryImages += $galleryWebpRel
      $provinceManifest.attribution += (New-Attribution -Province $province -Slug $slug -Role "gallery-$idx" -File $galleryWebpRel -Caption "$province tourism fallback image" -AttributionText 'Fallback from hero image' -Source $heroSource -IsFallback:$true)
      $downloadedCount += 1
    }

    $status = if ($provinceManifest.attribution.Where({ $_.isFallback }).Count -eq 0) { 'complete' } else { 'needs-curation' }

    $validation += [ordered]@{
      province = $province
      slug = $slug
      status = $status
      galleryCount = $provinceManifest.galleryImages.Count
      fallbackCount = $provinceManifest.attribution.Where({ $_.isFallback }).Count
    }

    $manifest += $provinceManifest

    if (-not $DryRun) {
      $provinceMetaPath = Join-Path $provinceDir 'metadata.json'
      $provinceManifest | ConvertTo-Json -Depth 8 | Set-Content -Path $provinceMetaPath -Encoding UTF8
    }
  } catch {
    $validation += [ordered]@{
      province = $province
      slug = $slug
      status = 'error'
      galleryCount = 0
      fallbackCount = 0
      error = $_.Exception.Message
    }
  }
}

if (-not $DryRun) {
  $manifestPath = Join-Path $baseDir 'manifest.json'
  $validationPath = Join-Path $baseDir 'validation-report.json'

  $manifest | ConvertTo-Json -Depth 8 | Set-Content -Path $manifestPath -Encoding UTF8
  $validation | ConvertTo-Json -Depth 6 | Set-Content -Path $validationPath -Encoding UTF8
}

$totals = [ordered]@{
  provinces = $validation.Count
  complete = ($validation | Where-Object { $_.status -eq 'complete' }).Count
  needsCuration = ($validation | Where-Object { $_.status -eq 'needs-curation' }).Count
  missingSource = ($validation | Where-Object { $_.status -eq 'missing-source-jpg' }).Count
}

$totals | ConvertTo-Json -Depth 4 | Write-Output
