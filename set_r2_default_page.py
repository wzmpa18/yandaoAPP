import requests
import os

CF_API_TOKEN = os.environ.get("CF_API_TOKEN", "your_cloudflare_token_here")
CF_ACCOUNT_ID = "10d815d2a0718caa6d0fa86a79c244c8"
BUCKET_NAME = "youdao-app"

headers = {
    "Authorization": f"Bearer {CF_API_TOKEN}",
    "Content-Type": "application/json"
}

def set_default_page():
    print("🔧 设置R2存储桶默认文档...")
    url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/r2/buckets/{BUCKET_NAME}"
    
    data = {
        "name": BUCKET_NAME,
        "default_object_path": "index.html"
    }
    
    response = requests.patch(url, headers=headers, json=data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.text}")
    
    if response.status_code == 200:
        print("✅ 默认文档设置成功！")
    else:
        print("❌ 设置失败，请手动在控制台配置")

def get_bucket_info():
    print("📋 获取存储桶信息...")
    url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/r2/buckets/{BUCKET_NAME}"
    response = requests.get(url, headers=headers)
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        info = response.json()["result"]
        print(f"存储桶: {info['name']}")
        print(f"默认文档: {info.get('default_object_path', '未设置')}")
        return info
    return None

def main():
    print("🚀 配置R2默认文档...")
    
    get_bucket_info()
    set_default_page()
    
    print("\n✅ 配置完成！现在访问 https://yandao.vip 应该可以正常显示首页了")

if __name__ == "__main__":
    main()