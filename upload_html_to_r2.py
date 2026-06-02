import requests
import os
import hashlib
import hmac
from datetime import datetime, timezone

R2_ACCESS_KEY = '159ce9bef15d75cfe8334bad8ccee4c7'
R2_SECRET_KEY = '40a747f48abcc885d92b700b2304c8c3ea7a3df0f57dfedda977249307cb3b19'
R2_ACCOUNT_ID = '10d815d2a0718caa6d0fa86a79c244c8'
R2_BUCKET = 'youdao-app'

def sign_request(method, host, uri, headers, body):
    now = datetime.now(timezone.utc)
    timestamp = now.strftime('%Y%m%dT%H%M%SZ')
    date = now.strftime('%Y%m%d')
    
    if body is None:
        body = b''
    
    content_sha256 = hashlib.sha256(body).hexdigest()
    
    canonical_headers = '\n'.join([f'{k.lower()}:{v}' for k, v in sorted(headers.items())]) + '\n'
    signed_headers = ';'.join([k.lower() for k in sorted(headers.keys())])
    
    credential_scope = f"{date}/auto/s3/aws4_request"
    
    canonical_request = f"{method}\n{uri}\n\n{canonical_headers}\n{signed_headers}\n{content_sha256}"
    canonical_request_hash = hashlib.sha256(canonical_request.encode()).hexdigest()
    
    string_to_sign = f"""AWS4-HMAC-SHA256
{timestamp}
{credential_scope}
{canonical_request_hash}"""
    
    def hmac_sha256(key, msg):
        if isinstance(msg, str):
            msg = msg.encode()
        return hmac.new(key, msg, hashlib.sha256).digest()
    
    k_date = hmac_sha256(f"AWS4{R2_SECRET_KEY}".encode(), date)
    k_region = hmac_sha256(k_date, 'auto')
    k_service = hmac_sha256(k_region, 's3')
    k_signing = hmac_sha256(k_service, 'aws4_request')
    signature = hmac.new(k_signing, string_to_sign.encode(), hashlib.sha256).hexdigest()
    
    authorization = f"AWS4-HMAC-SHA256 Credential={R2_ACCESS_KEY}/{credential_scope}, SignedHeaders={signed_headers}, Signature={signature}"
    
    return authorization, timestamp

def upload_file_to_r2(file_path, bucket_name, object_name=None, content_type='text/html'):
    if object_name is None:
        object_name = os.path.basename(file_path)
    
    host = f"{R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
    uri = f"/{bucket_name}/{object_name}"
    url = f"https://{host}{uri}"
    
    with open(file_path, 'rb') as f:
        file_content = f.read()
    
    headers = {
        'Content-Type': content_type,
        'Host': host,
    }
    
    authorization, timestamp = sign_request('PUT', host, uri, headers, file_content)
    
    headers['Authorization'] = authorization
    headers['X-Amz-Date'] = timestamp
    headers['X-Amz-Content-Sha256'] = hashlib.sha256(file_content).hexdigest()
    
    print(f"📤 正在上传 {file_path} 到 R2...")
    print(f"🔗 URL: {url}")
    
    response = requests.put(url, data=file_content, headers=headers)
    
    if response.status_code in [200, 201]:
        download_url = f"https://{bucket_name}.{R2_ACCOUNT_ID}.r2.dev/{object_name}"
        print(f"✅ 上传成功！")
        print(f"📥 下载链接: {download_url}")
        return download_url
    else:
        print(f"❌ 上传失败: {response.status_code}")
        print(f"📝 响应: {response.text[:500]}")
        return None

if __name__ == '__main__':
    files_to_upload = [
        ('index.html', 'text/html'),
        ('public/download.html', 'text/html'),
    ]
    
    print("🚀 开始上传HTML文件到R2存储桶...")
    
    for file_path, content_type in files_to_upload:
        if os.path.exists(file_path):
            print(f"\n📁 处理文件: {file_path}")
            file_size = os.path.getsize(file_path)
            print(f"   文件大小: {file_size} bytes")
            
            object_name = os.path.basename(file_path) if file_path == 'index.html' else 'download.html'
            upload_file_to_r2(file_path, R2_BUCKET, object_name, content_type)
        else:
            print(f"\n❌ 文件不存在: {file_path}")
    
    print("\n🎉 上传完成！")
