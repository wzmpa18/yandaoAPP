import boto3
import requests

R2_ACCESS_KEY = '88f6a8b0b359c64c7c0ca30f8be56c58'
R2_SECRET_KEY = 'f094837ebff96161e5af4fbb7aec5d58191a00288c0afd02549673af953a8d99'
R2_ACCOUNT_ID = '10d815d2a0718caa6d0fa86a79c244c8'
R2_BUCKET = 'youdao-app'
R2_ENDPOINT = f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com'

def list_bucket_files():
    print("📁 列出存储桶中的文件...")
    s3 = boto3.client(
        's3',
        endpoint_url=R2_ENDPOINT,
        aws_access_key_id=R2_ACCESS_KEY,
        aws_secret_access_key=R2_SECRET_KEY
    )
    
    try:
        response = s3.list_objects_v2(Bucket=R2_BUCKET)
        if 'Contents' in response:
            print(f"找到 {len(response['Contents'])} 个文件:")
            for obj in response['Contents']:
                print(f"  - {obj['Key']} ({obj['Size']} bytes)")
            return True
        else:
            print("❌ 存储桶为空")
            return False
    except Exception as e:
        print(f"❌ 访问存储桶失败: {e}")
        return False

def check_r2_dev_access():
    print("\n🔗 测试R2.dev直接访问...")
    urls = [
        f"https://{R2_BUCKET}.{R2_ACCOUNT_ID}.r2.dev/index.html",
        f"https://{R2_BUCKET}.{R2_ACCOUNT_ID}.r2.dev/app-release.apk"
    ]
    
    for url in urls:
        try:
            response = requests.head(url, timeout=10)
            print(f"{url}")
            print(f"   状态码: {response.status_code}")
            if response.status_code == 200:
                print("   ✅ 可访问")
            else:
                print(f"   ❌ 不可访问 (状态码: {response.status_code})")
        except Exception as e:
            print(f"   ❌ 访问失败: {e}")

def main():
    print("🚀 检查R2存储桶状态...")
    
    list_bucket_files()
    check_r2_dev_access()
    
    print("\n📋 当前可用链接:")
    print(f"  网页版: https://{R2_BUCKET}.{R2_ACCOUNT_ID}.r2.dev/index.html")
    print(f"  APK下载: https://{R2_BUCKET}.{R2_ACCOUNT_ID}.r2.dev/app-release.apk")

if __name__ == "__main__":
    main()