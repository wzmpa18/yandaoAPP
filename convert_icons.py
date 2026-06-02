import os
import shutil
from PIL import Image

# 源图片路径
source_image_path = r'C:\Users\ZhuanZ\Downloads\youdao-main (1)\youdao-main\微信图片_2026.jpg'

# Android图标目录和尺寸
mipmap_sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
}

# 目标目录
res_dir = r'C:\Users\ZhuanZ\Downloads\youdao-main (1)\youdao-main\android\app\src\main\res'

def resize_and_save(image, size, output_path):
    """调整图片大小并保存为PNG格式"""
    img = image.resize((size, size), Image.Resampling.LANCZOS)
    # 添加透明背景
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    img.save(output_path, 'PNG')
    print(f"✅ 已保存: {output_path}")

def main():
    if not os.path.exists(source_image_path):
        print(f"❌ 源图片不存在: {source_image_path}")
        return
    
    # 打开源图片
    try:
        source_img = Image.open(source_image_path)
        print(f"📷 源图片: {source_image_path}")
        print(f"📐 原始尺寸: {source_img.size}")
    except Exception as e:
        print(f"❌ 无法打开图片: {e}")
        return
    
    # 处理每个mipmap目录
    for mipmap_dir, size in mipmap_sizes.items():
        dir_path = os.path.join(res_dir, mipmap_dir)
        if not os.path.exists(dir_path):
            print(f"❌ 目录不存在: {dir_path}")
            continue
        
        # 替换两个图标文件
        for icon_name in ['ic_launcher.png', 'ic_launcher_round.png']:
            output_path = os.path.join(dir_path, icon_name)
            resize_and_save(source_img, size, output_path)
    
    print("\n🎉 图标更新完成！")

if __name__ == '__main__':
    main()
