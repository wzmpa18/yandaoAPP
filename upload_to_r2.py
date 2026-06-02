import os
import requests
import hashlib
import hmac
import datetime
from urllib.parse import quote

R2_ACCESS_KEY = '88f6a8b0b359c64c7c0ca30f8be56c58'
R2_SECRET_KEY = 'f094837ebff96161e5af4fbb7aec5d58191a00288c0afd02549673af953a8d99'
R2_ACCOUNT_ID = '10d815d2a0718caa6d0fa86a79c244c8'
R2_BUCKET = 'youdao-app'
R2_ENDPOINT = f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com'

def sign_request(method, path, headers, body=b''):
    timestamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    date = timestamp[:8]
    
    canonical_headers = ''
    signed_headers = ''
    header_keys = sorted([k.lower() for k in headers.keys()])
    for key in header_keys:
        canonical_headers += f"{key}:{headers[key]}\n"
        signed_headers += f"{key};"
    signed_headers = signed_headers[:-1]
    
    payload_hash = hashlib.sha256(body).hexdigest()
    
    canonical_request = f"{method}\n{path}\n\n{canonical_headers}\n{signed_headers}\n{payload_hash}"
    
    credential_scope = f"{date}/auto/s3/aws4_request"
    string_to_sign = f"AWS4-HMAC-SHA256\n{timestamp}\n{credential_scope}\n{hashlib.sha256(canonical_request.encode()).hexdigest()}"
    
    def hmac_sha256(key, msg):
        return hmac.new(key, msg.encode(), hashlib.sha256).digest()
    
    k_date = hmac_sha256(f"AWS4{R2_SECRET_KEY}".encode(), date)
    k_region = hmac_sha256(k_date, 'auto')
    k_service = hmac_sha256(k_region, 's3')
    k_signing = hmac_sha256(k_service, 'aws4_request')
    signature = hmac_sha256(k_signing, string_to_sign).hex()
    
    auth = f"AWS4-HMAC-SHA256 Credential={R2_ACCESS_KEY}/{credential_scope}, SignedHeaders={signed_headers}, Signature={signature}"
    return auth, timestamp

def upload_file(file_path, bucket, object_name=None):
    if object_name is None:
        object_name = os.path.basename(file_path)
    
    with open(file_path, 'rb') as f:
        body = f.read()
    
    path = f"/{bucket}/{quote(object_name)}"
    
    headers = {
        'x-amz-content-sha256': hashlib.sha256(body).hexdigest(),
        'x-amz-date': '',
        'host': f"{R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
    }
    
    auth, timestamp = sign_request('PUT', path, headers, body)
    headers['x-amz-date'] = timestamp
    headers['Authorization'] = auth
    
    url = f"{R2_ENDPOINT}/{bucket}/{quote(object_name)}"
    response = requests.put(url, headers=headers, data=body)
    
    if response.status_code in [200, 201]:
        print(f"✅ 上传成功: {object_name}")
        return True
    else:
        print(f"❌ 上传失败 {response.status_code}: {object_name}")
        print(f"   响应: {response.text}")
        return False

def upload_directory(directory, bucket, prefix=''):
    for root, dirs, files in os.walk(directory):
        for filename in files:
            local_path = os.path.join(root, filename)
            relative_path = os.path.relpath(local_path, directory)
            object_name = os.path.join(prefix, relative_path) if prefix else relative_path
            object_name = object_name.replace('\\', '/')
            upload_file(local_path, bucket, object_name)

print("🚀 开始上传文件到R2存储桶...")

print("\n📦 上传APK文件...")
apk_path = r"C:\Users\ZhuanZ\Downloads\youdao-main (1)\youdao-main\android\app\build\outputs\apk\release\app-release.apk"
upload_file(apk_path, R2_BUCKET, 'app-release.apk')

print("\n📂 上传dist目录...")
dist_dir = r"C:\Users\ZhuanZ\Downloads\youdao-main (1)\youdao-main\dist"
upload_directory(dist_dir, R2_BUCKET)

print("\n🎉 所有文件上传完成！")