$accessKey = "88f6a8b0b359c64c7c0ca30f8be56c58"
$secretKey = "f094837ebff96161e5af4fbb7aec5d58191a00288c0afd02549673af953a8d99"
$accountId = "10d815d2a0718caa6d0fa86a79c244c8"
$bucketName = "youdao-app"
$filePath = "android/app/build/outputs/apk/release/app-release.apk"
$r2Path = "app-release.apk"

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

$fileContent = [System.IO.File]::ReadAllBytes($filePath)
$contentHash = Get-HexString ([System.Security.Cryptography.SHA256]::Create().ComputeHash($fileContent))

$currentTime = [System.DateTime]::UtcNow
$requestDate = $currentTime.ToString("yyyyMMddTHHmmssZ")
$date = $currentTime.ToString("yyyyMMdd")

$canonicalUri = "/$bucketName/$r2Path"
$canonicalHeaders = "content-type:application/vnd.android.package-archive`nhost:$accountId.r2.cloudflarestorage.com`nx-amz-content-sha256:$contentHash`nx-amz-date:$requestDate`n"
$signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date"

$canonicalRequest = "PUT`n$canonicalUri`n`n$canonicalHeaders`n$signedHeaders`n$contentHash"
$canonicalRequestBytes = [System.Text.Encoding]::UTF8.GetBytes($canonicalRequest)
$hashedCanonicalRequest = Get-HexString ([System.Security.Cryptography.SHA256]::Create().ComputeHash($canonicalRequestBytes))

$credentialScope = "$date/auto/s3/aws4_request"
$stringToSign = "AWS4-HMAC-SHA256`n$requestDate`n$credentialScope`n$hashedCanonicalRequest"

$kSecret = [System.Text.Encoding]::UTF8.GetBytes("AWS4$secretKey")
$kDate = Get-HMACSHA256 -key $kSecret -data ([System.Text.Encoding]::UTF8.GetBytes($date))
$kRegion = Get-HMACSHA256 -key $kDate -data ([System.Text.Encoding]::UTF8.GetBytes("auto"))
$kService = Get-HMACSHA256 -key $kRegion -data ([System.Text.Encoding]::UTF8.GetBytes("s3"))
$kSigning = Get-HMACSHA256 -key $kService -data ([System.Text.Encoding]::UTF8.GetBytes("aws4_request"))

$signature = Get-HexString (Get-HMACSHA256 -key $kSigning -data ([System.Text.Encoding]::UTF8.GetBytes($stringToSign)))
$authorization = "AWS4-HMAC-SHA256 Credential=$accessKey/$credentialScope, SignedHeaders=$signedHeaders, Signature=$signature"

$headers = @{
    "Content-Type" = "application/vnd.android.package-archive"
    "x-amz-content-sha256" = $contentHash
    "x-amz-date" = $requestDate
    "Authorization" = $authorization
}

Write-Host "Uploading app-release.apk..."
Invoke-WebRequest -Uri "https://$accountId.r2.cloudflarestorage.com/$bucketName/$r2Path" -Method PUT -Headers $headers -Body $fileContent -UseBasicParsing | Out-Null
Write-Host "OK"