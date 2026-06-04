# 言道 · 内容上传脚本
# 将离线学习内容上传到 Cloudflare R2 CDN
# 用法: .\scripts\upload-content-to-r2.ps1

$accountId = "10d815d2a0718caa6d0fa86a79c244c8"
$bucketName = "youdao-app"
$accessKey = "88f6a8b0b359c64c7c0ca30f8be56c58"
$secretKey = "f094837ebff96161e5af4fbb7aec5d58191a00288c0afd02549673af953a8d99"
$endpoint = "https://$accountId.r2.cloudflarestorage.com"

Write-Host "🚀 言道内容上传到 Cloudflare R2" -ForegroundColor Cyan
Write-Host "=" * 50

$contentDir = Join-Path $PSScriptRoot ".." "dist" "data"
if (-not (Test-Path $contentDir)) {
    # 尝试从public/data读取
    $contentDir = Join-Path $PSScriptRoot ".." "public" "data"
}

if (-not (Test-Path $contentDir)) {
    Write-Host "❌ 未找到数据目录！请先运行 npm run build" -ForegroundColor Red
    exit 1
}

Write-Host "📂 数据目录: $contentDir" -ForegroundColor Green

# 上传函数
function Upload-File {
    param($localPath, $r2Path, $contentType)
    
    $fileContent = [System.IO.File]::ReadAllBytes($localPath)
    $contentHash = [System.Security.Cryptography.SHA256]::Create().ComputeHash($fileContent)
    $contentHashHex = [System.BitConverter]::ToString($contentHash).Replace("-", "").ToLower()
    
    $date = (Get-Date).ToUniversalTime().ToString("yyyyMMddTHHmmssZ")
    $dateShort = (Get-Date).ToUniversalTime().ToString("yyyyMMdd")
    $region = "auto"
    $service = "s3"
    
    # 构建签名
    $scope = "$dateShort/$region/$service/aws4_request"
    $canonicalUri = "/$bucketName/$r2Path"
    $canonicalQueryString = ""
    $canonicalHeaders = "content-type:$contentType`nhost:$accountId.r2.cloudflarestorage.com`nx-amz-content-sha256:$contentHashHex`nx-amz-date:$date`n"
    $signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date"
    
    $canonicalRequest = "PUT`n$canonicalUri`n$canonicalQueryString`n$canonicalHeaders`n$signedHeaders`n$contentHashHex"
    $canonicalRequestHash = [System.Security.Cryptography.SHA256]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes($canonicalRequest))
    $canonicalRequestHashHex = [System.BitConverter]::ToString($canonicalRequestHash).Replace("-", "").ToLower()
    
    $stringToSign = "AWS4-HMAC-SHA256`n$date`n$scope`n$canonicalRequestHashHex"
    
    function HMAC-SHA256($key, $data) {
        $hmac = New-Object System.Security.Cryptography.HMACSHA256
        $hmac.Key = $key
        return $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($data))
    }
    
    $kSecret = [System.Text.Encoding]::UTF8.GetBytes("AWS4$secretKey")
    $kDate = HMAC-SHA256 $kSecret $dateShort
    $kRegion = HMAC-SHA256 $kDate $region
    $kService = HMAC-SHA256 $kRegion $service
    $kSigning = HMAC-SHA256 $kService "aws4_request"
    $signature = [System.BitConverter]::ToString((HMAC-SHA256 $kSigning $stringToSign)).Replace("-", "").ToLower()
    
    $authorization = "AWS4-HMAC-SHA256 Credential=$accessKey/$scope,SignedHeaders=$signedHeaders,Signature=$signature"
    
    $headers = @{
        "Content-Type" = $contentType
        "Host" = "$accountId.r2.cloudflarestorage.com"
        "x-amz-content-sha256" = $contentHashHex
        "x-amz-date" = $date
        "Authorization" = $authorization
    }
    
    $uri = "https://$accountId.r2.cloudflarestorage.com/$bucketName/$r2Path"
    
    try {
        Invoke-WebRequest -Uri $uri -Method PUT -Headers $headers -Body $fileContent -UseBasicParsing | Out-Null
        Write-Host "  ✅ $r2Path" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "  ❌ $r2Path : $_" -ForegroundColor Red
        return $false
    }
}

# 上传所有数据文件
$files = Get-ChildItem -Path $contentDir -Filter "*.json"
$success = 0
$fail = 0

foreach ($file in $files) {
    $r2Path = "content/$($file.Name)"
    $result = Upload-File -localPath $file.FullName -r2Path $r2Path -contentType "application/json"
    if ($result) { $success++ } else { $fail++ }
}

Write-Host ""
Write-Host "=" * 50
Write-Host "📊 上传完成: 成功 $success, 失败 $fail" -ForegroundColor Cyan
Write-Host "🔗 CDN地址: https://$bucketName.$accountId.r2.dev/content/" -ForegroundColor Green
