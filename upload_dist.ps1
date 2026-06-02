$accessKey = "159ce9bef15d75cfe8334bad8ccee4c7"
$secretKey = "40a747f48abcc885d92b700b2304c8c3ea7a3df0f57dfedda977249307cb3b19"
$accountId = "10d815d2a0718caa6d0fa86a79c244c8"
$bucketName = "youdao-app"
$endpoint = "https://$accountId.r2.cloudflarestorage.com"

function Get-HMACSHA256 {
    param(
        [byte[]]$key,
        [string]$message
    )
    $hmacsha = New-Object System.Security.Cryptography.HMACSHA256
    $hmacsha.Key = $key
    return $hmacsha.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($message))
}

function Get-Signature {
    param(
        [string]$accessKey,
        [string]$secretKey,
        [string]$method,
        [string]$contentType,
        [string]$date,
        [string]$resource
    )
    $stringToSign = "$method`n`n$contentType`n$date`n$resource"
    $secretBytes = [System.Text.Encoding]::UTF8.GetBytes($secretKey)
    $signature = Get-HMACSHA256 -key $secretBytes -message $stringToSign
    return [Convert]::ToBase64String($signature)
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
    
    $date = Get-Date -Format "r"
    $resource = "/$bucketName/$r2Path"
    
    $signature = Get-Signature -accessKey $accessKey -secretKey $secretKey -method $method -contentType $contentType -date $date -resource $resource
    $authHeader = "AWS $accessKey`:$signature"
    
    $headers = @{
        "Authorization" = $authHeader
        "Date" = $date
        "Content-Type" = $contentType
    }
    
    $uri = "$endpoint$resource"
    Write-Host "Uploading $filePath -> $r2Path"
    Invoke-WebRequest -Uri $uri -Method $method -Headers $headers -InFile $filePath -UseBasicParsing
}

Get-ChildItem -Path "dist" -Recurse | ForEach-Object {
    if (-not $_.PSIsContainer) {
        $relativePath = $_.FullName.Replace((Get-Location).Path + "\dist\", "").Replace("\", "/")
        Upload-File -filePath $_.FullName -r2Path $relativePath
    }
}

Write-Host "✅ 所有文件上传完成！"