import requests
import os

CF_API_TOKEN = os.environ.get("CF_API_TOKEN", "your_cloudflare_token_here")
CF_ACCOUNT_ID = "10d815d2a0718caa6d0fa86a79c244c8"
BUCKET_NAME = "youdao-app"
DOMAIN = "yandao.vip"

headers = {
    "Authorization": f"Bearer {CF_API_TOKEN}",
    "Content-Type": "application/json"
}

def get_zone_id():
    print("🔍 查找域名 zone ID...")
    url = f"https://api.cloudflare.com/client/v4/zones?name={DOMAIN}"
    response = requests.get(url, headers=headers)
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        zones = response.json()["result"]
        if zones:
            zone_id = zones[0]["id"]
            print(f"✅ 找到zone ID: {zone_id}")
            return zone_id
    print(f"❌ 响应: {response.text}")
    return None

def create_r2_custom_domain(zone_id):
    print("🔧 创建R2自定义域名绑定...")
    url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/r2/buckets/{BUCKET_NAME}/custom_domain"
    data = {
        "name": DOMAIN,
        "zone_id": zone_id,
        "ssl": "strict"
    }
    response = requests.post(url, headers=headers, json=data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.text}")
    if response.status_code == 200:
        print("✅ R2自定义域名创建成功！")
        return response.json()["result"]
    return None

def get_r2_custom_domains():
    print("📋 获取当前R2自定义域名配置...")
    url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/r2/buckets/{BUCKET_NAME}/custom_domain"
    response = requests.get(url, headers=headers)
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        return response.json()["result"]
    return None

def main():
    print("🚀 开始配置R2自定义域名...")
    
    zone_id = get_zone_id()
    if not zone_id:
        print("❌ 无法获取zone ID")
        return
    
    existing_domains = get_r2_custom_domains()
    if existing_domains:
        print("⚠️ 已存在的自定义域名:")
        for domain in existing_domains:
            print(f"  - {domain['name']} ({domain.get('status', 'unknown')})")
    
    result = create_r2_custom_domain(zone_id)
    if result:
        print("\n🎉 配置完成！")
        print(f"域名: {result['name']}")
        print(f"状态: {result.get('status', 'pending')}")
        print(f"SSL: {result.get('ssl', 'unknown')}")
        print("\n⏳ 请等待5-10分钟让配置生效")
        print("访问 https://yandao.vip 即可查看网站")

if __name__ == "__main__":
    main()