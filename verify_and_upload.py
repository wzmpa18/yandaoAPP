import os
import subprocess
import sys

def check_file_exists(filepath):
    exists = os.path.exists(filepath)
    status = "✅" if exists else "❌"
    print(f"{status} {filepath}")
    return exists

def check_privacy_files():
    print("\n📋 检查隐私条款和服务协议文件:")
    privacy_files = [
        "miniprogram/pages/agreements/privacy.wxml",
        "miniprogram/pages/agreements/service.wxml",
        "miniprogram/pages/agreements/disclaimer.wxml",
        "miniprogram/pages/agreements/community.wxml",
        "miniprogram/pages/agreements/complaint.wxml",
        "src/components/PrivacySettings.tsx"
    ]
    
    all_exist = True
    for f in privacy_files:
        if not check_file_exists(f):
            all_exist = False
    return all_exist

def check_icons():
    print("\n🖼️ 检查Android图标:")
    icon_dirs = [
        "android/app/src/main/res/mipmap-mdpi/",
        "android/app/src/main/res/mipmap-hdpi/",
        "android/app/src/main/res/mipmap-xhdpi/",
        "android/app/src/main/res/mipmap-xxhdpi/",
        "android/app/src/main/res/mipmap-xxxhdpi/"
    ]
    
    icon_files = ["ic_launcher.png", "ic_launcher_round.png"]
    all_exist = True
    
    for dir_path in icon_dirs:
        for icon in icon_files:
            filepath = dir_path + icon
            if not check_file_exists(filepath):
                all_exist = False
    return all_exist

def check_apk():
    print("\n📱 检查APK文件:")
    apk_path = "android/app/build/outputs/apk/release/app-release.apk"
    return check_file_exists(apk_path)

def check_dist():
    print("\n🌐 检查前端构建产物:")
    dist_files = [
        "dist/index.html",
        "dist/download.html",
        "dist/assets/index-Dji6ucH8.js",
        "dist/assets/index-mP4UC7rr.css"
    ]
    
    all_exist = True
    for f in dist_files:
        if not check_file_exists(f):
            all_exist = False
    return all_exist

def update_download_page():
    print("\n🔄 更新下载页面...")
    download_html_path = "dist/download.html"
    if os.path.exists(download_html_path):
        with open(download_html_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        content = content.replace(
            '<a href="#" class="download-btn ios disabled" id="iosBtn">',
            '<a href="https://testflight.apple.com/join/XXXXX" class="download-btn ios" id="iosBtn">'
        )
        content = content.replace(
            '<span class="btn-text">\n                    iOS APP (即将上线)\n                    <small>TestFlight 内测中</small>\n                </span>',
            '<span class="btn-text">\n                    下载 iOS APP\n                    <small>TestFlight 内测版</small>\n                </span>'
        )
        
        with open(download_html_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("✅ 下载页面已更新")
        return True
    else:
        print("❌ 下载页面不存在")
        return False

def upload_all():
    print("\n📤 上传所有文件到服务器...")
    try:
        # 上传dist目录
        subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-File", "upload_dist_sigv4.ps1"], 
                      check=True, capture_output=True)
        print("✅ dist目录上传成功")
        
        # 上传APK
        subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-File", "upload_apk.ps1"], 
                      check=True, capture_output=True)
        print("✅ APK上传成功")
        
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ 上传失败: {e}")
        return False

def main():
    print("🚀 开始验证和上传项目...")
    
    # 检查所有文件
    privacy_ok = check_privacy_files()
    icons_ok = check_icons()
    apk_ok = check_apk()
    dist_ok = check_dist()
    
    # 更新下载页面
    update_ok = update_download_page()
    
    # 上传到服务器
    upload_ok = upload_all()
    
    print("\n" + "="*60)
    print("📊 验证结果:")
    print(f"  隐私条款: {'✅ 通过' if privacy_ok else '❌ 缺失'}")
    print(f"  APP图标: {'✅ 通过' if icons_ok else '❌ 缺失'}")
    print(f"  APK文件: {'✅ 通过' if apk_ok else '❌ 缺失'}")
    print(f"  前端产物: {'✅ 通过' if dist_ok else '❌ 缺失'}")
    print(f"  页面更新: {'✅ 通过' if update_ok else '❌ 失败'}")
    print(f"  服务器上传: {'✅ 通过' if upload_ok else '❌ 失败'}")
    print("="*60)
    
    if all([privacy_ok, icons_ok, apk_ok, dist_ok, update_ok, upload_ok]):
        print("\n🎉 所有检查通过！项目已成功上传到服务器！")
        print("\n📥 下载链接:")
        print("  Android APK: https://youdao-app.10d815d2a0718caa6d0fa86a79c244c8.r2.dev/app-release.apk")
        print("  下载页面: https://youdao-app.10d815d2a0718caa6d0fa86a79c244c8.r2.dev/download.html")
        print("  Web版: https://youdao-app.10d815d2a0718caa6d0fa86a79c244c8.r2.dev/index.html")
        return 0
    else:
        print("\n⚠️ 部分检查未通过，请查看上面的错误信息")
        return 1

if __name__ == "__main__":
    sys.exit(main())