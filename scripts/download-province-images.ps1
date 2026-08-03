$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $root 'assets/images/provinces'
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

$provinceList = @(
  'Amnat Charoen','Ang Thong','Bangkok','Bueng Kan','Buri Ram','Chachoengsao','Chai Nat','Chaiyaphum','Chanthaburi','Chiang Mai',
  'Chiang Rai','Chonburi','Chumphon','Kalasin','Kamphaeng Phet','Kanchanaburi','Khon Kaen','Krabi','Lampang','Lamphun',
  'Loei','Lop Buri','Mae Hong Son','Maha Sarakham','Mukdahan','Nakhon Nayok','Nakhon Pathom','Nakhon Phanom','Nakhon Ratchasima','Nakhon Sawan',
  'Nakhon Si Thammarat','Nan','Narathiwat','Nong Bua Lamphu','Nong Khai','Nonthaburi','Pathum Thani','Pattani','Phang Nga','Phatthalung',
  'Phayao','Phetchabun','Phetchaburi','Phichit','Phitsanulok','Phra Nakhon Si Ayutthaya','Phrae','Phuket','Prachin Buri','Prachuap Khiri Khan',
  'Ranong','Ratchaburi','Rayong','Roi Et','Sa Kaeo','Sakon Nakhon','Samut Prakan','Samut Sakhon','Samut Songkhram','Saraburi',
  'Satun','Si Sa Ket','Sing Buri','Songkhla','Sukhothai','Suphan Buri','Surat Thani','Surin','Tak','Trang',
  'Trat','Ubon Ratchathani','Udon Thani','Uthai Thani','Uttaradit','Yala','Yasothon'
)

if ($provinceList.Count -ne 77) {
  throw "Expected 77 provinces, got $($provinceList.Count)."
}

function Get-Slug([string]$name) {
  $slug = $name.ToLowerInvariant() -replace "[^a-z0-9]+", '-'
  return $slug.Trim('-')
}

function Normalize-ProvinceLabel([string]$label) {
  $normalized = $label -replace '\s+province$', '' -replace '^Province of ', ''
  $normalized = $normalized -replace 'Buri Ram', 'Buriram'
  $normalized = $normalized -replace 'Si Sa Ket', 'Sisaket'
  $normalized = $normalized -replace 'Roi Et', 'Roi Et'
  return $normalized
}

function Get-CommonsThumbUrl([string]$specialFilePathUrl) {
  $marker = '/Special:FilePath/'
  $idx = $specialFilePathUrl.IndexOf($marker)
  if ($idx -lt 0) {
    return $specialFilePathUrl
  }

  $encodedName = $specialFilePathUrl.Substring($idx + $marker.Length)
  $decodedName = [uri]::UnescapeDataString($encodedName)
  $normalizedName = $decodedName -replace ' ', '_'

  $md5 = [System.Security.Cryptography.MD5]::Create()
  try {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($normalizedName)
    $hashBytes = $md5.ComputeHash($bytes)
    $hash = -join ($hashBytes | ForEach-Object { $_.ToString('x2') })
  }
  finally {
    $md5.Dispose()
  }

  $first = $hash.Substring(0, 1)
  $firstTwo = $hash.Substring(0, 2)
  $safeName = [uri]::EscapeDataString($normalizedName)
  return "https://upload.wikimedia.org/wikipedia/commons/thumb/$first/$firstTwo/$safeName/1200px-$safeName"
}

function Get-WikipediaSummaryThumb([string]$provinceName) {
  $title = if ($provinceName -eq 'Bangkok') {
    'Bangkok'
  }
  else {
    ($provinceName -replace ' ', '_') + '_province'
  }

  $encoded = [uri]::EscapeDataString($title)
  $url = "https://en.wikipedia.org/api/rest_v1/page/summary/$encoded"
  $summary = Invoke-RestMethod -Uri $url -Method Get -Headers @{ 'User-Agent' = 'ThailandTravelGuideImageBot/1.0 (contact: bot-traffic@wikimedia.org)' }
  if ($summary.thumbnail -and $summary.thumbnail.source) {
    return [string]$summary.thumbnail.source
  }
  return $null
}

function Invoke-WithRetry {
  param(
    [Parameter(Mandatory = $true)][scriptblock]$Operation,
    [Parameter(Mandatory = $true)][string]$TaskName
  )
  $maxTry = 6
  for ($attempt = 1; $attempt -le $maxTry; $attempt++) {
    try {
      return & $Operation
    }
    catch {
      if ($attempt -eq $maxTry) {
        throw
      }
      Write-Warning "$TaskName failed on attempt $attempt/${maxTry}: $($_.Exception.Message)"
      # Retry immediately; external services may accept subsequent requests.
    }
  }
}

$sparql = @"
SELECT ?provinceLabel ?image WHERE {
  ?province wdt:P31 wd:Q50198;
            wdt:P17 wd:Q869;
            wdt:P18 ?image.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
"@

$encodedSparql = [uri]::EscapeDataString($sparql)
$sparqlUrl = "https://query.wikidata.org/sparql?format=json&query=$encodedSparql"
$headers = @{ 'User-Agent' = 'ThailandTravelGuideImageBot/1.0 (contact: bot-traffic@wikimedia.org)' }

$sparqlResult = Invoke-WithRetry -TaskName 'Fetch SPARQL province image list' -Operation {
  Invoke-RestMethod -Uri $sparqlUrl -Method Get -Headers $headers
}

$imageByProvince = @{}
foreach ($row in $sparqlResult.results.bindings) {
  $label = Normalize-ProvinceLabel([string]$row.provinceLabel.value)
  $url = [string]$row.image.value
  if ($label -and $url) {
    $imageByProvince[$label] = $url
  }
}

# Known normalization aliases between data labels and Wikidata English labels.
$aliases = @{
  'Buri Ram' = 'Buriram'
  'Si Sa Ket' = 'Sisaket'
  'Chonburi' = 'Chon Buri'
  'Lop Buri' = 'Lopburi'
}

$manualFallbackImage = @{
  'Loei' = 'https://commons.wikimedia.org/wiki/Special:FilePath/Phra_That_Si_Song_Rak.jpg'
  'Nan' = 'https://commons.wikimedia.org/wiki/Special:FilePath/2013_Wat_Phumin_Nan.jpg'
}

$manifest = @()
$failed = @()

foreach ($province in $provinceList) {
  $slug = Get-Slug $province
  $localPath = Join-Path $outputDir ($slug + '.jpg')
  $lookup = if ($aliases.ContainsKey($province)) { $aliases[$province] } else { $province }

  if (Test-Path $localPath) {
    Write-Host "Skip existing: $province -> $slug.jpg"
    continue
  }

  $imageUrl = $null
  if ($imageByProvince.ContainsKey($lookup)) {
    $imageUrl = Get-CommonsThumbUrl($imageByProvince[$lookup])
  }
  else {
    Write-Warning "No Wikidata mapping for: $province, falling back to Wikipedia summary image"
    if ($manualFallbackImage.ContainsKey($province)) {
      $imageUrl = Get-CommonsThumbUrl($manualFallbackImage[$province])
    }
    try {
      if (-not $imageUrl) {
        $imageUrl = Get-WikipediaSummaryThumb($province)
      }
    }
    catch {
      $imageUrl = $null
    }
  }

  if (-not $imageUrl) {
    $failed += [pscustomobject]@{ province = $province; reason = 'No image URL from Wikidata/Wikipedia fallback' }
    continue
  }

  try {
    Invoke-WithRetry -TaskName "Download image for $province" -Operation {
      Invoke-WebRequest -Uri $imageUrl -OutFile $localPath -Headers $headers
    } | Out-Null

    $manifest += [pscustomobject]@{
      province = $province
      wikidataLabel = $lookup
      imageUrl = $imageUrl
      localPath = "assets/images/provinces/$slug.jpg"
      retrievedAtUtc = [DateTime]::UtcNow.ToString('o')
      source = 'Wikidata P18'
    }

    Write-Host "Downloaded: $province -> $slug.jpg"
  }
  catch {
    $failed += [pscustomobject]@{ province = $province; reason = $_.Exception.Message }
    Write-Warning "Failed: $province - $($_.Exception.Message)"
  }
}

$manifestPath = Join-Path $outputDir 'sources.json'
$manifest | Sort-Object province | ConvertTo-Json -Depth 4 | Set-Content -Path $manifestPath -Encoding UTF8

if ($failed.Count -gt 0) {
  $failedPath = Join-Path $outputDir 'failed.json'
  $failed | Sort-Object province | ConvertTo-Json -Depth 4 | Set-Content -Path $failedPath -Encoding UTF8
  throw "Failed to download $($failed.Count) province images. See $failedPath"
}

if (Test-Path (Join-Path $outputDir 'failed.json')) {
  Remove-Item (Join-Path $outputDir 'failed.json') -Force
}

Write-Host "Success: Downloaded $($manifest.Count) province images to $outputDir"
