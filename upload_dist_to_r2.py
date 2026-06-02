import boto3
import os

R2_ACCESS_KEY = '88f6a8b0b359c64c7c0ca30f8be56c58'
R2_SECRET_KEY = 'f094837ebff96161e5af4fbb7aec5d58191a00288c0afd02549673af953a8d99'
R2_ACCOUNT_ID = '10d815d2a0718caa6d0fa86a79c244c8'
R2_BUCKET = 'youdao-app'
R2_ENDPOINT = f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com'

s3 = boto3.client(
    's3',
    endpoint_url=R2_ENDPOINT,
    aws_access_key_id=R2_ACCESS_KEY,
    aws_secret_access_key=R2_SECRET_KEY
)

dist_dir = 'dist'
for root, dirs, files in os.walk(dist_dir):
    for file in files:
        local_path = os.path.join(root, file)
        r2_path = os.path.relpath(local_path, dist_dir).replace('\\', '/')
        print(f'Uploading {local_path} -> {r2_path}')
        with open(local_path, 'rb') as f:
            content_type = None
            if r2_path.endswith('.html'):
                content_type = 'text/html; charset=utf-8'
            elif r2_path.endswith('.css'):
                content_type = 'text/css'
            elif r2_path.endswith('.js'):
                content_type = 'application/javascript'
            elif r2_path.endswith('.svg'):
                content_type = 'image/svg+xml'
            s3.put_object(Bucket=R2_BUCKET, Key=r2_path, Body=f, ContentType=content_type)

print('✅ 所有文件上传完成！')