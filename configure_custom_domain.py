import requests
import json

# Cloudflare API配置
API_TOKEN = "cfut_aYzL3zHN6AALxR6kUTd4jUmRmb9q1sxNTDmRAAdb739488b3"
ACCOUNT_ID = "10d815d2a0718caa6d0fa86a79c244c8"
BUCKET_NAME = "youdao-app"
DOMAIN = "yandao.vip"

headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

def get_zone_id(domain):
    """获取域名Zone ID"""
    url = f"https://api.cloudflare.com/client/v4/zones?name={domain}"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        result = response.json()
        if result["success"] and result["result"]:
            return result["result"][0]["id"]
    print(f"❌ 获取Zone ID失败: {response.text}")
    return None

def create_cname_record(zone_id, name, content):
    """创建CNAME记录"""
    url = f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records"
    data = {
        "type": "CNAME",
        "name": name,
        "content": content,
        "ttl": 300,
        "proxied": True
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        result = response.json()
        if result["success"]:
            print(f"✅ 创建CNAME记录成功: {name} -> {content}")
            return True
    print(f"❌ 创建CNAME记录失败: {response.text}")
    return False

def configure_r2_custom_domain():
    """配置R2自定义域名"""
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET_NAME}/custom_domain"
    data = {
        "hostname": f"{DOMAIN}",
        "ssl": "strict"
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200 or response.status_code == 201:
        result = response.json()
        if result.get("success", True):
            print(f"✅ 配置R2自定义域名成功: {DOMAIN}")
            return True
    print(f"❌ 配置R2自定义域名失败: {response.text}")
    return False

def main():
    print("🚀 开始配置自定义域名...")
    
    # 1. 获取Zone ID
    print("\n1/3: 获取域名Zone ID...")
    zone_id = get_zone_id(DOMAIN)
    if not zone_id:
        print("❌ 无法获取Zone ID，请检查域名是否已添加到Cloudflare")
        return
    
    print(f"   Zone ID: {zone_id}")
    
    # 2. 创建CNAME记录
    print("\n2/3: 创建CNAME记录...")
    # 获取R2存储桶的默认域名
    r2_domain = f"{BUCKET_NAME}.{ACCOUNT_ID}.r2.cloudflarestorage.com"
    print(f"   R2域名: {r2_domain}")
    
    # 创建根域名CNAME
    create_cname_record(zone_id, DOMAIN, r2_domain)
    
    # 创建www子域名CNAME
    create_cname_record(zone_id, f"www.{DOMAIN}", r2_domain)
    
    # 3. 配置R2自定义域名
    print("\n3/3: 配置R2自定义域名...")
    configure_r2_custom_domain()
    
    print("\n🎉 自定义域名配置完成！")
    print(f"   域名: https://{DOMAIN}")
    print(f"   域名: https://www.{DOMAIN}")

if __name__ == "__main__":
    main()