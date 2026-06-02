import requests

CF_API_TOKEN = "40a747f48abcc885d92b700b2304c8c3ea7a3df0f57dfedda977249307cb3b19"

headers = {
    "Authorization": f"Bearer {CF_API_TOKEN}",
    "Content-Type": "application/json"
}

def list_zones():
    print("🔍 列出所有Cloudflare域名...")
    url = "https://api.cloudflare.com/client/v4/zones"
    response = requests.get(url, headers=headers)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.text[:2000]}")

def check_r2_bucket():
    print("\n📦 检查R2存储桶...")
    url = "https://api.cloudflare.com/client/v4/accounts/10d815d2a0718caa6d0fa86a79c244c8/r2/buckets"
    response = requests.get(url, headers=headers)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.text[:2000]}")

if __name__ == "__main__":
    list_zones()
    check_r2_bucket()