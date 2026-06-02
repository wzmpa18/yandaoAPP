import os
from PIL import Image

parrot_path = 'public/parrot.jpg'
splash_dirs = [
    'android/app/src/main/res/drawable',
    'android/app/src/main/res/drawable-land-hdpi',
    'android/app/src/main/res/drawable-land-mdpi',
    'android/app/src/main/res/drawable-land-xhdpi',
    'android/app/src/main/res/drawable-land-xxhdpi',
    'android/app/src/main/res/drawable-land-xxxhdpi',
    'android/app/src/main/res/drawable-port-hdpi',
    'android/app/src/main/res/drawable-port-mdpi',
    'android/app/src/main/res/drawable-port-xhdpi',
    'android/app/src/main/res/drawable-port-xxhdpi',
    'android/app/src/main/res/drawable-port-xxxhdpi',
]

splash_sizes = {
    'mdpi': (320, 480),
    'hdpi': (480, 720),
    'xhdpi': (720, 1280),
    'xxhdpi': (960, 1600),
    'xxxhdpi': (1280, 1920),
}

def get_size_from_dir(dir_name):
    for size_name in splash_sizes:
        if size_name in dir_name:
            return splash_sizes[size_name]
    return (1080, 1920)

try:
    parrot = Image.open(parrot_path)
    print(f"Original parrot image size: {parrot.size}")
    
    for splash_dir in splash_dirs:
        if not os.path.exists(splash_dir):
            os.makedirs(splash_dir)
        
        size = get_size_from_dir(splash_dir)
        print(f"Processing {splash_dir} with size {size}")
        
        background = Image.new('RGB', size, (63, 63, 136))
        
        parrot_size = min(size[0], size[1]) // 3
        parrot_resized = parrot.resize((parrot_size, parrot_size), Image.LANCZOS)
        
        x = (size[0] - parrot_size) // 2
        y = (size[1] - parrot_size) // 2
        
        background.paste(parrot_resized, (x, y), parrot_resized if parrot.mode == 'RGBA' else None)
        
        splash_path = os.path.join(splash_dir, 'splash.png')
        background.save(splash_path, 'PNG')
        print(f"  -> {splash_path}")
    
    print("\n✅ 启动页图标更新完成！")
    
except Exception as e:
    print(f"❌ 错误: {e}")
    import traceback
    traceback.print_exc()