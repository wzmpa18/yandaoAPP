import os
from PIL import Image

# 鹦鹉图片路径
parrot_path = r"C:\Users\ZhuanZ\Downloads\youdao-main (1)\youdao-main\微信图片_2026.jpg"

# 目标目录
res_dir = r"C:\Users\ZhuanZ\Downloads\youdao-main (1)\youdao-main\android\app\src\main\res"

# 各分辨率大小
mipmap_sizes = {
    'mipmap-mdpi': (48, 48),
    'mipmap-hdpi': (72, 72),
    'mipmap-xhdpi': (96, 96),
    'mipmap-xxhdpi': (144, 144),
    'mipmap-xxxhdpi': (192, 192)
}

def create_rounded_icon(image, size):
    """创建圆角图标"""
    img = image.resize(size, Image.LANCZOS)
    
    # 创建带圆角的蒙版
    mask = Image.new('L', size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), size], radius=size[0]//4, fill=255)
    
    # 应用蒙版
    result = Image.new('RGBA', size, (255, 255, 255, 0))
    result.paste(img, (0, 0), mask)
    
    return result

def create_adaptive_icon(image, size):
    """创建自适应图标前景"""
    img = image.resize((int(size[0]*0.7), int(size[1]*0.7)), Image.LANCZOS)
    offset = ((size[0] - img.width) // 2, (size[1] - img.height) // 2)
    
    result = Image.new('RGBA', size, (255, 255, 255, 0))
    result.paste(img, offset)
    
    return result

try:
    from PIL import ImageDraw
except ImportError:
    print("需要安装Pillow库")
    exit(1)

try:
    # 打开鹦鹉图片
    parrot = Image.open(parrot_path).convert('RGBA')
    print("✅ 成功打开鹦鹉图片")
    
    # 为每个分辨率创建图标
    for mipmap, size in mipmap_sizes.items():
        mipmap_dir = os.path.join(res_dir, mipmap)
        
        # 创建普通图标 (正方形)
        icon = parrot.resize(size, Image.LANCZOS)
        icon_path = os.path.join(mipmap_dir, 'ic_launcher.png')
        icon.save(icon_path, 'PNG')
        print(f"✅ 更新 {mipmap}/ic_launcher.png")
        
        # 创建圆角图标
        rounded_icon = create_rounded_icon(parrot, size)
        rounded_path = os.path.join(mipmap_dir, 'ic_launcher_round.png')
        rounded_icon.save(rounded_path, 'PNG')
        print(f"✅ 更新 {mipmap}/ic_launcher_round.png")
        
        # 创建前景图标 (用于自适应图标)
        foreground = create_adaptive_icon(parrot, size)
        foreground_path = os.path.join(mipmap_dir, 'ic_launcher_foreground.png')
        foreground.save(foreground_path, 'PNG')
        print(f"✅ 更新 {mipmap}/ic_launcher_foreground.png")
    
    print("\n🎉 所有图标已成功更新为鹦鹉头像！")
    
except Exception as e:
    print(f"❌ 错误: {e}")