import os
import random

# 目标目录
base_dir = r'C:\Users\ZhuanZ\Downloads\youdao-main (1)\youdao-main\android\app\src\main\assets\public'

def generate_additional_resources():
    """生成更多资源文件来增加APK大小"""
    # 创建视频教程目录
    video_dir = os.path.join(base_dir, 'videos')
    if not os.path.exists(video_dir):
        os.makedirs(video_dir)
    
    total_size_mb = 0
    target_size_mb = 200  # 再添加200MB
    
    # 生成视频文件
    for i in range(20):
        file_size = random.randint(8, 15) * 1024 * 1024  # 8-15 MB
        file_path = os.path.join(video_dir, f'tutorial_{i:03d}.mp4')
        
        with open(file_path, 'wb') as f:
            f.write(os.urandom(file_size))
        
        total_size_mb += file_size / (1024 * 1024)
        print(f"📹 创建视频: {file_path} ({file_size/1024/1024:.1f} MB)")
        
        if total_size_mb >= target_size_mb:
            break
    
    # 生成更多音频文件
    audio_dir = os.path.join(base_dir, 'audio', 'lessons')
    if not os.path.exists(audio_dir):
        os.makedirs(audio_dir)
    
    languages = ['en', 'ja', 'ko', 'fr', 'es', 'de']
    for lang in languages:
        if total_size_mb >= target_size_mb:
            break
        
        lang_dir = os.path.join(audio_dir, lang)
        if not os.path.exists(lang_dir):
            os.makedirs(lang_dir)
        
        for i in range(20):
            file_size = random.randint(3, 5) * 1024 * 1024  # 3-5 MB
            file_path = os.path.join(lang_dir, f'lesson_{i:03d}.mp3')
            
            with open(file_path, 'wb') as f:
                f.write(os.urandom(file_size))
            
            total_size_mb += file_size / (1024 * 1024)
            print(f"🎵 创建音频: {file_path} ({file_size/1024/1024:.1f} MB)")
            
            if total_size_mb >= target_size_mb:
                break
    
    return total_size_mb

def main():
    print("📦 开始生成更多资源文件...")
    print()
    
    total_size = generate_additional_resources()
    
    print()
    print("✅ 资源生成完成！")
    print(f"💾 新增资源大小: {total_size:.2f} MB")

if __name__ == '__main__':
    main()
