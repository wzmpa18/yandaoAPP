$API_TOKEN = "cfut_aYzL3zHN6AALxR6kUTd4jUmRmb9q1sxNTDmRAAdb739488b3"
$ACCOUNT_ID = "10d815d2a0718caa6d0fa86a79c244c8"
$BUCKET_NAME = "youdao-app"
$DOMAIN = "yandao.vip"

$headers = @{
    "Authorization" = "Bearer $API_TOKEN"
    "Content-Type" = "application/json"
}

Write-Host "Starting domain configuration for $DOMAIN..."

$zoneUrl = "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN"
try {
    $response = Invoke-WebRequest -Uri $zoneUrl -Headers $headers -Method Get -UseBasicParsing
    $result = $response.Content | ConvertFrom-Json
    if ($result.success -and $result.result) {
        $zoneId = $result.result[0].id
        Write-Host "Zone ID found: $zoneId"
    } else {
        Write-Host "Failed to get Zone ID"
        exit 1
    }
} catch {
    Write-Host "Error getting Zone ID: $_"
    exit 1
}

$r2Domain = "$BUCKET_NAME.$ACCOUNT_ID.r2.cloudflarestorage.com"
Write-Host "R2 domain: $r2Domain"

$cnameData = @{
    type = "CNAME"
    name = $DOMAIN
    content = $r2Domain
    ttl = 300
    proxied = $true
} | ConvertTo-Json

$cnameUrl = "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records"
try {
    $response = Invoke-WebRequest -Uri $cnameUrl -Headers $headers -Method Post -Body $cnameData -UseBasicParsing
    $result = $response.Content | ConvertFrom-Json
    if ($result.success) {
        Write-Host "Created root CNAME record: $DOMAIN -> $r2Domain"
    } else {
        Write-Host "Root CNAME may already exist"
    }
} catch {
    Write-Host "Root CNAME may exist or failed: $_"
}

$wwwData = @{
    type = "CNAME"
    name = "www.$DOMAIN"
    content = $r2Domain
    ttl = 300
    proxied = $true
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $cnameUrl -Headers $headers -Method Post -Body $wwwData -UseBasicParsing
    $result = $response.Content | ConvertFrom-Json
    if ($result.success) {
        Write-Host "Created www CNAME record: www.$DOMAIN -> $r2Domain"
    } else {
        Write-Host "www CNAME may already exist"
    }
} catch {
    Write-Host "www CNAME may exist or failed: $_"
}

$r2Url = "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/r2/buckets/$BUCKET_NAME/custom_domain"
$r2Data = @{
    hostname = $DOMAIN
    ssl = "strict"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $r2Url -Headers $headers -Method Post -Body $r2Data -UseBasicParsing
    $result = $response.Content | ConvertFrom-Json
    if ($result.success -or $response.StatusCode -eq 201) {
        Write-Host "R2 custom domain configured: $DOMAIN"
    } else {
        Write-Host "R2 custom domain may already be configured"
    }
} catch {
    Write-Host "R2 custom domain may exist or failed: $_"
}

Write-Host "Domain configuration completed!"
Write-Host "Domain: https://$DOMAIN"
Write-Host "Domain: https://www.$DOMAIN"