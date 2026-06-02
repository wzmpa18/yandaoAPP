$accessKey = "88f6a8b0b359c64c7c0ca30f8be56c58"
$secretKey = "f094837ebff96161e5af4fbb7aec5d58191a00288c0afd02549673af953a8d99"
$accountId = "10d815d2a0718caa6d0fa86a79c244c8"
$bucketName = "youdao-app"
$region = "auto"
$service = "s3"

function Get-HMACSHA256 {
    param(
        [byte[]]$key,
        [byte[]]$data
    )
    $hmacsha = New-Object System.Security.Cryptography.HMACSHA256
    $hmacsha.Key = $key
    return $hmacsha.ComputeHash($data)
}

function Get-HexString {
    param([byte[]]$bytes)
    return -join ($bytes | ForEach-Object { $_.ToString("x2") })
}

function Upload-File {
    param(
        [string]$filePath,
        [string]$r2Path
    )
    $method = "PUT"
    $contentType = "application/octet-stream"
    if ($r2Path.EndsWith(".html")) { $contentType = "text/html; charset=utf-8" }
    elseif ($r2Path.EndsWith(".css")) { $contentType = "text/css" }
    elseif ($r2Path.EndsWith(".js")) { $contentType = "application/javascript" }
    elseif ($r2Path.EndsWith(".svg")) { $contentType = "image/svg+xml" }
    
    $currentTime = [System.DateTime]::UtcNow
    $requestDate = $currentTime.ToString("yyyyMMddTHHmmssZ")
    $date = $currentTime.ToString("yyyyMMdd")
    
    $canonicalUri = "/$bucketName/$r2Path"
    $canonicalQueryString = ""
    
    $fileContent = [System.IO.File]::ReadAllBytes($filePath)
    $contentHash = Get-HexString ([System.Security.Cryptography.SHA256]::Create().ComputeHash($fileContent))
    
    $canonicalHeaders = "content-type:$contentType`nhost:$accountId.r2.cloudflarestorage.com`nx-amz-content-sha256:$contentHash`nx-amz-date:$requestDate`n"
    $signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date"
    
    $canonicalRequest = "$method`n$canonicalUri`n$canonicalQueryString`n$canonicalHeaders`n$signedHeaders`n$contentHash"
    
    $canonicalRequestBytes = [System.Text.Encoding]::UTF8.GetBytes($canonicalRequest)
    $hashedCanonicalRequest = Get-HexString ([System.Security.Cryptography.SHA256]::Create().ComputeHash($canonicalRequestBytes))
    
    $credentialScope = "$date/$region/$service/aws4_request"
    $stringToSign = "AWS4-HMAC-SHA256`n$requestDate`n$credentialScope`n$hashedCanonicalRequest"
    
    $kSecret = [System.Text.Encoding]::UTF8.GetBytes("AWS4$secretKey")
    $kDate = Get-HMACSHA256 -key $kSecret -data ([System.Text.Encoding]::UTF8.GetBytes($date))
    $kRegion = Get-HMACSHA256 -key $kDate -data ([System.Text.Encoding]::UTF8.GetBytes($region))
    $kService = Get-HMACSHA256 -key $kRegion -data ([System.Text.Encoding]::UTF8.GetBytes($service))
    $kSigning = Get-HMACSHA256 -key $kService -data ([System.Text.Encoding]::UTF8.GetBytes("aws4_request"))
    
    $signature = Get-HexString (Get-HMACSHA256 -key $kSigning -data ([System.Text.Encoding]::UTF8.GetBytes($stringToSign)))
    
    $authorization = "AWS4-HMAC-SHA256 Credential=$accessKey/$credentialScope, SignedHeaders=$signedHeaders, Signature=$signature"
    
    $headers = @{
        "Content-Type" = $contentType
        "x-amz-content-sha256" = $contentHash
        "x-amz-date" = $requestDate
        "Authorization" = $authorization
    }
    
    $uri = "https://$accountId.r2.cloudflarestorage.com/$bucketName/$r2Path"
    Write-Host "Uploading $r2Path"
    
    try {
        Invoke-WebRequest -Uri $uri -Method $method -Headers $headers -Body $fileContent -UseBasicParsing -ErrorAction Stop | Out-Null
        Write-Host "  OK"
    } catch {
        Write-Host "  ERROR: $_"
    }
}

Get-ChildItem -Path "dist" -Recurse | ForEach-Object {
    if (-not $_.PSIsContainer) {
        $relativePath = $_.FullName.Replace((Get-Location).Path + "\dist\", "").Replace("\", "/")
        Upload-File -filePath $_.FullName -r2Path $relativePath
    }
}

Write-Host "Done"