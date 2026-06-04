"""
R2 公开访问开启脚本
通过 Cloudflare API 启用 R2.dev 子域名的公开访问权限
"""

import requests
import os
import sys

# === 配置 ===
CF_ACCOUNT_ID = "10d815d2a0718caa6d0fa86a79c244c8"
BUCKET_NAME = "youdao-app"

# Cloudflare API Token - 需要 R2 读写权限
# 在 https://dash.cloudflare.com/profile/api-tokens 创建
# 权限: Account → R2 Storage → Edit
CF_API_TOKEN = os.environ.get("CF_API_TOKEN", "")

HEADERS = {
    "Authorization": f"Bearer {CF_API_TOKEN}",
    "Content-Type": "application/json"
}

BASE_URL = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}"


def check_token():
    """验证 API Token 是否有效"""
    print("🔑 验证 API Token...")
    resp = requests.get(
        f"https://api.cloudflare.com/client/v4/user/tokens/verify",
        headers=HEADERS
    )
    if resp.status_code == 200:
        data = resp.json()
        if data.get("success"):
            print(f"   ✅ Token 有效 (状态: {data['result']['status']})")
            return True
    print(f"   ❌ Token 无效: {resp.status_code} {resp.text[:200]}")
    return False


def list_buckets():
    """列出所有 R2 存储桶"""
    resp = requests.get(f"{BASE_URL}/r2/buckets", headers=HEADERS)
    if resp.status_code == 200:
        buckets = resp.json().get("result", [])
        print(f"   📦 找到 {len(buckets)} 个存储桶:")
        for b in buckets:
            print(f"      - {b['name']} (创建: {b.get('creation_date', 'N/A')})")
        return buckets
    print(f"   ❌ 获取桶列表失败: {resp.text[:200]}")
    return []


def enable_r2_dev_domain():
    """
    通过 API 启用/管理 R2.dev 子域名
    注意：R2.dev 公开访问需要通过 Cloudflare Dashboard 或特定 API 操作
    """
    print(f"\n🌐 为 {BUCKET_NAME} 配置 R2.dev 公开访问...")
    
    # 方法1：通过 managed domain endpoint
    # R2 public access 通过 set domain access 来管理
    url = f"{BASE_URL}/r2/buckets/{BUCKET_NAME}/domains/managed"
    
    resp = requests.put(url, headers=HEADERS, json={"enabled": True})
    print(f"   响应: {resp.status_code}")
    
    if resp.status_code == 200:
        result = resp.json()
        if result.get("success"):
            print(f"   ✅ R2.dev 公开访问已启用!")
            return True
        else:
            print(f"   ⚠️ API 返回: {result}")
    else:
        print(f"   响应内容: {resp.text[:300]}")
    
    return False


def get_bucket_info():
    """获取桶的详细信息"""
    resp = requests.get(f"{BASE_URL}/r2/buckets/{BUCKET_NAME}", headers=HEADERS)
    if resp.status_code == 200:
        data = resp.json().get("result", {})
        print(f"\n📋 桶信息:")
        print(f"   名称: {data.get('name')}")
        print(f"   创建时间: {data.get('creation_date')}")
        print(f"   位置: {data.get('location')}")
        return data
    return None


def test_public_access():
    """测试 R2.dev 公开访问"""
    import time
    urls = [
        f"https://{BUCKET_NAME}.{CF_ACCOUNT_ID}.r2.dev/download.html",
        f"https://{BUCKET_NAME}.{CF_ACCOUNT_ID}.r2.dev/android/yandao-latest.apk",
    ]
    
    print(f"\n🔗 测试公开访问 (等待 5 秒让配置生效)...")
    time.sleep(5)
    
    for url in urls:
        try:
            resp = requests.head(url, timeout=15, allow_redirects=True)
            print(f"   {url}")
            print(f"      → {resp.status_code} {'✅' if resp.status_code == 200 else '❌'}")
        except Exception as e:
            print(f"   {url}")
            print(f"      → ❌ 失败: {e}")


def main():
    print("=" * 60)
    print("🚀 R2 公开访问配置工具")
    print("=" * 60)
    
    if not CF_API_TOKEN:
        print("\n❌ 错误: 未设置 CF_API_TOKEN 环境变量!")
        print("\n请按以下步骤操作:")
        print("1. 访问 https://dash.cloudflare.com/profile/api-tokens")
        print("2. 创建 Token → 使用自定义模板")
        print("3. 权限: Account → R2 Storage → Edit")
        print("4. 运行: set CF_API_TOKEN=你的token && python enable_r2_public.py")
        print("\n或者手动操作:")
        print("1. 访问 https://dash.cloudflare.com/")
        print("2. 左侧菜单 → R2")
        print("3. 点击桶 'youdao-app'")
        print("4. Settings 标签页")
        print("5. Public Access → R2.dev Subdomain → 点击 'Allow Access'")
        print("6. 确认后，文件即可通过以下地址访问:")
        print(f"   https://{BUCKET_NAME}.{CF_ACCOUNT_ID}.r2.dev/download.html")
        print(f"   https://{BUCKET_NAME}.{CF_ACCOUNT_ID}.r2.dev/android/yandao-latest.apk")
        sys.exit(1)
    
    # 验证 Token
    if not check_token():
        print("\n⚠️ Token 验证失败，但仍尝试配置...")
    
    # 获取桶信息
    get_bucket_info()
    
    # 列表桶
    list_buckets()
    
    # 启用公开访问
    if enable_r2_dev_domain():
        test_public_access()
    
    print(f"\n📋 下载地址:")
    print(f"   网页: https://{BUCKET_NAME}.{CF_ACCOUNT_ID}.r2.dev/download.html")
    print(f"   APK:  https://{BUCKET_NAME}.{CF_ACCOUNT_ID}.r2.dev/android/yandao-latest.apk")
    print(f"   IPA:  https://{BUCKET_NAME}.{CF_ACCOUNT_ID}.r2.dev/ios/yandao-latest.ipa")


if __name__ == "__main__":
    main()
