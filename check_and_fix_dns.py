import requests
import os

CF_API_TOKEN = os.environ.get("CF_API_TOKEN", "your_cloudflare_token_here")
CF_ACCOUNT_ID = "10d815d2a0718caa6d0fa86a79c244c8"
DOMAIN = "yandao.vip"

headers = {
    "Authorization": f"Bearer {CF_API_TOKEN}",
    "Content-Type": "application/json"
}

def get_zones():
    print("🔍 列出所有域名...")
    url = "https://api.cloudflare.com/client/v4/zones"
    response = requests.get(url, headers=headers)
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        zones = response.json()["result"]
        print(f"找到 {len(zones)} 个域名")
        for zone in zones:
            print(f"  - {zone['name']} (ID: {zone['id']})")
        return zones
    return None

def get_dns_records(zone_id):
    print(f"\n📋 获取 {DOMAIN} 的DNS记录...")
    url = f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records"
    response = requests.get(url, headers=headers)
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        records = response.json()["result"]
        print(f"找到 {len(records)} 条DNS记录")
        for record in records:
            print(f"  {record['type']} {record['name']} -> {record['content']} (代理: {'已代理' if record['proxied'] else '仅DNS'})")
        return records
    return None

def delete_dns_record(zone_id, record_id):
    print(f"\n🗑️ 删除DNS记录 {record_id}...")
    url = f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records/{record_id}"
    response = requests.delete(url, headers=headers)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.text}")
    return response.status_code == 200

def check_r2_bucket():
    print("\n📦 检查R2存储桶...")
    url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/r2/buckets"
    response = requests.get(url, headers=headers)
    print(f"状态码: {response.status_code}")
    if response.status_code == 200:
        buckets = response.json()["result"]
        print(f"找到 {len(buckets)} 个存储桶")
        for bucket in buckets:
            print(f"  - {bucket['name']}")
        return buckets
    return None

def main():
    print("🚀 开始排查DNS配置问题...")
    
    zones = get_zones()
    if not zones:
        print("❌ 无法获取域名列表")
        return
    
    target_zone = None
    for zone in zones:
        if zone["name"] == DOMAIN:
            target_zone = zone
            break
    
    if not target_zone:
        print(f"❌ 未找到域名 {DOMAIN}")
        return
    
    print(f"\n✅ 找到域名: {target_zone['name']} (ID: {target_zone['id']})")
    
    records = get_dns_records(target_zone["id"])
    if records:
        for record in records:
            if record["type"] == "CNAME" and ".r2.dev" in record["content"]:
                print(f"\n⚠️ 发现问题DNS记录: {record['name']} -> {record['content']}")
                print("   这个记录直接指向r2.dev是不允许的！")
    
    check_r2_bucket()
    
    print("\n📖 解决方案：")
    print("1. 删除现有的CNAME记录（指向.r2.dev的）")
    print("2. 在R2存储桶设置中添加自定义域名")
    print("3. Cloudflare会自动创建正确的DNS记录")

if __name__ == "__main__":
    main()