import os
import shutil

# 源数据目录
source_data_dir = r'C:\Users\ZhuanZ\Downloads\youdao-main (1)\youdao-main\tufs_data'

# 目标assets目录
target_assets_dir = r'C:\Users\ZhuanZ\Downloads\youdao-main (1)\youdao-main\android\app\src\main\assets\public\data'

def copy_directory(source, target):
    """复制目录到目标位置"""
    if not os.path.exists(target):
        os.makedirs(target)
    
    for item in os.listdir(source):
        s = os.path.join(source, item)
        t = os.path.join(target, item)
        if os.path.isdir(s):
            shutil.copytree(s, t, dirs_exist_ok=True)
            print(f"📂 复制目录: {s} -> {t}")
        else:
            shutil.copy2(s, t)
            print(f"📄 复制文件: {s}")

def main():
    print("📦 开始添加资源到APK...")
    print()
    
    # 复制词典数据
    print("📚 复制词典数据...")
    copy_directory(source_data_dir, target_assets_dir)
    
    # 显示统计信息
    total_files = 0
    total_size = 0
    for root, dirs, files in os.walk(target_assets_dir):
        for file in files:
            total_files += 1
            total_size += os.path.getsize(os.path.join(root, file))
    
    print()
    print("✅ 资源添加完成！")
    print(f"📊 添加了 {total_files} 个文件")
    print(f"💾 总大小: {total_size / (1024 * 1024):.2f} MB")

if __name__ == '__main__':
    main()
