import os
import random

# 目标目录
audio_dir = r'C:\Users\ZhuanZ\Downloads\youdao-main (1)\youdao-main\android\app\src\main\assets\public\audio\words'

def generate_dummy_audio_files():
    """生成虚拟音频文件来增加APK大小"""
    if not os.path.exists(audio_dir):
        os.makedirs(audio_dir)
    
    # 生成多个大文件
    languages = ['en', 'ja', 'ko', 'fr', 'es', 'de']
    total_size_mb = 0
    target_size_mb = 100  # 目标大小约100MB
    
    for lang in languages:
        lang_dir = os.path.join(audio_dir, lang)
        if not os.path.exists(lang_dir):
            os.makedirs(lang_dir)
        
        # 每种语言生成一些文件
        for i in range(50):
            # 每个文件大约1-2MB
            file_size = random.randint(1, 2) * 1024 * 1024  # 1-2 MB
            file_path = os.path.join(lang_dir, f'word_{i:04d}.mp3')
            
            # 创建大文件
            with open(file_path, 'wb') as f:
                f.write(os.urandom(file_size))
            
            total_size_mb += file_size / (1024 * 1024)
            print(f"📄 创建文件: {file_path} ({file_size/1024/1024:.1f} MB)")
            
            # 达到目标大小就停止
            if total_size_mb >= target_size_mb:
                break
        
        if total_size_mb >= target_size_mb:
            break
    
    return total_size_mb

def main():
    print("📦 开始生成大资源文件...")
    print()
    
    total_size = generate_dummy_audio_files()
    
    print()
    print("✅ 资源生成完成！")
    print(f"💾 生成资源总大小: {total_size:.2f} MB")

if __name__ == '__main__':
    main()
