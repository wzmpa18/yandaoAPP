import requests
import os

CF_API_TOKEN = os.environ.get("CF_API_TOKEN", "your_cloudflare_token_here")
CF_ACCOUNT_ID = "10d815d2a0718caa6d0fa86a79c244c8"
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

def get_dns_records(zone_id):
    print("\n📋 获取当前DNS记录...")
    url = f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        records = response.json()["result"]
        print(f"当前DNS记录 ({len(records)}条):")
        for record in records:
            print(f"  - {record['name']} ({record['type']}): {record['content']}")
        return records
    return None

def create_cname_record(zone_id):
    print("\n🔧 创建www子域名CNAME记录...")
    url = f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records"
    data = {
        "type": "CNAME",
        "name": "www",
        "content": DOMAIN,
        "ttl": 1,
        "proxied": True
    }
    response = requests.post(url, headers=headers, json=data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.text}")
    if response.status_code == 200:
        print("✅ www子域名CNAME记录创建成功！")
        return response.json()["result"]
    return None

def main():
    print("🚀 开始配置www子域名...")
    
    zone_id = get_zone_id()
    if not zone_id:
        print("❌ 无法获取zone ID")
        return
    
    existing_records = get_dns_records(zone_id)
    if existing_records:
        has_www = any(record["name"] == "www.yandao.vip" for record in existing_records)
        if has_www:
            print("⚠️ www.yandao.vip记录已存在")
            return
    
    result = create_cname_record(zone_id)
    if result:
        print("\n🎉 配置完成！")
        print(f"域名: {result['name']}")
        print(f"类型: {result['type']}")
        print(f"目标: {result['content']}")
        print("\n⏳ 请等待DNS记录生效（5-10分钟）")
        print("访问 https://www.yandao.vip 即可查看网站")

if __name__ == "__main__":
    main()