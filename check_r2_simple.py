import requests

R2_ACCOUNT_ID = '10d815d2a0718caa6d0fa86a79c244c8'
R2_BUCKET = 'youdao-app'

def check_r2_dev_access():
    print("🔗 测试R2.dev直接访问...")
    
    urls = [
        f"https://{R2_BUCKET}.{R2_ACCOUNT_ID}.r2.dev/index.html",
        f"https://{R2_BUCKET}.{R2_ACCOUNT_ID}.r2.dev/app-release.apk",
        f"https://{R2_BUCKET}.{R2_ACCOUNT_ID}.r2.dev/download.html"
    ]
    
    for url in urls:
        try:
            response = requests.get(url, timeout=15)
            print(f"\n测试: {url}")
            print(f"状态码: {response.status_code}")
            if response.status_code == 200:
                print("✅ 可访问")
                if url.endswith('.html'):
                    print(f"内容长度: {len(response.text)} 字符")
                else:
                    print(f"文件大小: {len(response.content)} 字节")
            else:
                print(f"❌ 不可访问 (状态码: {response.status_code})")
        except requests.exceptions.RequestException as e:
            print(f"\n测试: {url}")
            print(f"❌ 访问失败: {e}")

def check_custom_domain():
    print("\n\n🔗 测试自定义域名 yandao.vip...")
    
    urls = [
        "https://yandao.vip",
        "https://yandao.vip/index.html",
        "https://yandao.vip/app-release.apk"
    ]
    
    for url in urls:
        try:
            response = requests.get(url, timeout=15)
            print(f"\n测试: {url}")
            print(f"状态码: {response.status_code}")
            if response.status_code == 200:
                print("✅ 可访问")
            else:
                print(f"❌ 不可访问 (状态码: {response.status_code})")
                if response.status_code == 503:
                    print("   提示: 服务暂时不可用，可能正在初始化")
                elif response.status_code == 1014:
                    print("   提示: CNAME跨账户禁止，需要使用R2自定义域名功能")
        except requests.exceptions.RequestException as e:
            print(f"\n测试: {url}")
            print(f"❌ 访问失败: {e}")

def main():
    print("🚀 开始检查R2存储桶状态...")
    print("="*50)
    
    check_r2_dev_access()
    check_custom_domain()
    
    print("\n\n📋 总结:")
    print("="*50)
    print(f"R2直接链接: https://{R2_BUCKET}.{R2_ACCOUNT_ID}.r2.dev")
    print("自定义域名: https://yandao.vip")
    print("\n⚠️ 如果自定义域名无法访问，请确保：")
    print("1. 在R2存储桶设置中添加了自定义域名")
    print("2. 删除了直接指向.r2.dev的CNAME记录")
    print("3. 等待SSL证书签发完成（5-10分钟）")

if __name__ == "__main__":
    main()