import requests
import zipfile
import tarfile
import os
import json
import uuid
import xml.etree.ElementTree as ET
from pathlib import Path

SUPABASE_URL = 'https://mfwvwohgpxgeihmqludt.supabase.co'
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_KEY', 'your_supabase_service_key_here')

def download_file(url, filename):
    print(f"📥 下载 {filename}...")
    try:
        response = requests.get(url, timeout=120, stream=True)
        response.raise_for_status()
        
        with open(filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"✅ 下载完成: {filename} ({os.path.getsize(filename)//1024//1024} MB)")
        return True
    except Exception as e:
        print(f"❌ 下载失败: {e}")
        return False

def extract_archive(filepath, extract_dir):
    print(f"📦 解压 {filepath}...")
    try:
        if filepath.endswith('.zip'):
            with zipfile.ZipFile(filepath, 'r') as zip_ref:
                zip_ref.extractall(extract_dir)
        elif filepath.endswith('.tar.gz') or filepath.endswith('.tgz'):
            with tarfile.open(filepath, 'r:gz') as tar_ref:
                tar_ref.extractall(extract_dir)
        elif filepath.endswith('.tar'):
            with tarfile.open(filepath, 'r') as tar_ref:
                tar_ref.extractall(extract_dir)
        
        print(f"✅ 解压完成到: {extract_dir}")
        return True
    except Exception as e:
        print(f"❌ 解压失败: {e}")
        return False

def parse_opus_xml(filepath, lang_pair):
    """解析OPUS XML格式文件"""
    entries = []
    try:
        tree = ET.parse(filepath)
        root = tree.getroot()
        
        for doc in root.findall('.//document'):
            for p in doc.findall('.//p'):
                src_text = ''
                tgt_text = ''
                
                for seg in p.findall('.//seg'):
                    lang = seg.get('lang')
                    if lang == lang_pair[0]:
                        src_text = seg.text.strip() if seg.text else ''
                    elif lang == lang_pair[1]:
                        tgt_text = seg.text.strip() if seg.text else ''
                
                if src_text and tgt_text:
                    entries.append((src_text, tgt_text))
    
    except Exception as e:
        print(f"❌ 解析XML失败: {e}")
    
    return entries

def parse_opus_plain(filepath, lang_pair):
    """解析OPUS纯文本格式文件"""
    entries = []
    try:
        src_file = filepath.replace('.xml', f'.{lang_pair[0]}')
        tgt_file = filepath.replace('.xml', f'.{lang_pair[1]}')
        
        if os.path.exists(src_file) and os.path.exists(tgt_file):
            with open(src_file, 'r', encoding='utf-8', errors='replace') as f:
                src_lines = f.readlines()
            with open(tgt_file, 'r', encoding='utf-8', errors='replace') as f:
                tgt_lines = f.readlines()
            
            for src, tgt in zip(src_lines, tgt_lines):
                src = src.strip()
                tgt = tgt.strip()
                if src and tgt:
                    entries.append((src, tgt))
    
    except Exception as e:
        print(f"❌ 解析纯文本失败: {e}")
    
    return entries

def import_to_supabase(items):
    if not items:
        return 0
    
    url = f"{SUPABASE_URL}/rest/v1/contents"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(items))
        if response.status_code in [200, 201]:
            return len(items)
        else:
            print(f"  ❌ 导入错误: {response.status_code} - {response.text[:200]}")
            return 0
    except Exception as e:
        print(f"  ❌ 导入异常: {e}")
        return 0

def process_jesc(lang):
    """处理日语JESC语料"""
    url = 'https://object.pouta.csc.fi/OPUS-JESC/v1.0/moses/en-ja.txt.zip'
    filename = 'jesc_en-ja.zip'
    extract_dir = Path('opus_data/jesc')
    
    if not download_file(url, filename):
        return []
    
    if not extract_archive(filename, extract_dir):
        return []
    
    entries = []
    txt_file = extract_dir / 'en-ja.txt'
    
    if txt_file.exists():
        with open(txt_file, 'r', encoding='utf-8', errors='replace') as f:
            for line in f:
                parts = line.strip().split('\t')
                if len(parts) >= 2:
                    entries.append((parts[0], parts[1]))
    
    return entries[:10000]

def process_korean_news(lang):
    """处理韩语新闻语料"""
    url = 'https://object.pouta.csc.fi/OPUS-KoreanNews/v1.0/moses/ko-en.txt.zip'
    filename = 'korean_news.zip'
    extract_dir = Path('opus_data/korean')
    
    if not download_file(url, filename):
        return []
    
    if not extract_archive(filename, extract_dir):
        return []
    
    entries = []
    txt_file = extract_dir / 'ko-en.txt'
    
    if txt_file.exists():
        with open(txt_file, 'r', encoding='utf-8', errors='replace') as f:
            for line in f:
                parts = line.strip().split('\t')
                if len(parts) >= 2:
                    entries.append((parts[0], parts[1]))
    
    return entries[:10000]

def process_europarl(lang):
    """处理Europarl语料"""
    lang_codes = {
        'fr': 'fr-en',
        'es': 'es-en',
        'de': 'de-en'
    }
    
    code = lang_codes.get(lang)
    if not code:
        return []
    
    url = f'https://object.pouta.csc.fi/OPUS-Europarl/v8/moses/{code}.txt.zip'
    filename = f'europarl_{code}.zip'
    extract_dir = Path(f'opus_data/europarl_{lang}')
    
    if not download_file(url, filename):
        return []
    
    if not extract_archive(filename, extract_dir):
        return []
    
    entries = []
    txt_file = extract_dir / f'{code}.txt'
    
    if txt_file.exists():
        with open(txt_file, 'r', encoding='utf-8', errors='replace') as f:
            for line in f:
                parts = line.strip().split('\t')
                if len(parts) >= 2:
                    entries.append((parts[0], parts[1]))
    
    return entries[:10000]

def process_dgt(lang):
    """处理DGT翻译记忆库"""
    lang_codes = {
        'it': 'it-en',
        'pt': 'pt-en'
    }
    
    code = lang_codes.get(lang)
    if not code:
        return []
    
    url = f'https://object.pouta.csc.fi/OPUS-DGT/v2021/moses/{code}.txt.zip'
    filename = f'dgt_{code}.zip'
    extract_dir = Path(f'opus_data/dgt_{lang}')
    
    if not download_file(url, filename):
        return []
    
    if not extract_archive(filename, extract_dir):
        return []
    
    entries = []
    txt_file = extract_dir / f'{code}.txt'
    
    if txt_file.exists():
        with open(txt_file, 'r', encoding='utf-8', errors='replace') as f:
            for line in f:
                parts = line.strip().split('\t')
                if len(parts) >= 2:
                    entries.append((parts[0], parts[1]))
    
    return entries[:10000]

def process_un_arabic(lang):
    """处理UN阿拉伯语平行语料"""
    url = 'https://object.pouta.csc.fi/OPUS-UN/v1.0/moses/ar-en.txt.zip'
    filename = 'un_ar-en.zip'
    extract_dir = Path('opus_data/un_arabic')
    
    if not download_file(url, filename):
        return []
    
    if not extract_archive(filename, extract_dir):
        return []
    
    entries = []
    txt_file = extract_dir / 'ar-en.txt'
    
    if txt_file.exists():
        with open(txt_file, 'r', encoding='utf-8', errors='replace') as f:
            for line in f:
                parts = line.strip().split('\t')
                if len(parts) >= 2:
                    entries.append((parts[0], parts[1]))
    
    return entries[:10000]

def process_multiun(lang):
    """处理MultiUN中文语料"""
    url = 'https://object.pouta.csc.fi/OPUS-MultiUN/v1.0/moses/zh-en.txt.zip'
    filename = 'multiun_zh-en.zip'
    extract_dir = Path('opus_data/multiun')
    
    if not download_file(url, filename):
        return []
    
    if not extract_archive(filename, extract_dir):
        return []
    
    entries = []
    txt_file = extract_dir / 'zh-en.txt'
    
    if txt_file.exists():
        with open(txt_file, 'r', encoding='utf-8', errors='replace') as f:
            for line in f:
                parts = line.strip().split('\t')
                if len(parts) >= 2:
                    entries.append((parts[0], parts[1]))
    
    return entries[:10000]

def main():
    print("🚀 开始从OPUS语料库下载真实数据...\n")
    
    Path('opus_data').mkdir(exist_ok=True)
    
    languages = [
        {'code': 'ja', 'name': '日语', 'processor': process_jesc},
        {'code': 'ko', 'name': '韩语', 'processor': process_korean_news},
        {'code': 'fr', 'name': '法语', 'processor': process_europarl},
        {'code': 'es', 'name': '西班牙语', 'processor': process_europarl},
        {'code': 'de', 'name': '德语', 'processor': process_europarl},
        {'code': 'it', 'name': '意大利语', 'processor': process_dgt},
        {'code': 'pt', 'name': '葡萄牙语', 'processor': process_dgt},
        {'code': 'ar', 'name': '阿拉伯语', 'processor': process_un_arabic},
        {'code': 'zh', 'name': '中文', 'processor': process_multiun},
    ]
    
    stats = {}
    total_entries = 0
    
    for lang in languages:
        print(f"\n=== 处理 {lang['name']} ({lang['code']}) ===")
        
        entries = lang['processor'](lang['code'])
        stats[lang['code']] = len(entries)
        total_entries += len(entries)
        
        print(f"✅ 解析到 {len(entries)} 条平行语料")
        
        if entries:
            items = []
            for src, tgt in entries[:50]:
                items.append({
                    'id': str(uuid.uuid4()),
                    'type': 'translation',
                    'language': lang['code'],
                    'title': src[:50] if len(src) > 50 else src,
                    'content': src,
                    'translation': tgt,
                    'level': '1',
                    'source': 'opus',
                    'usage_count': 0,
                })
            
            imported = import_to_supabase(items)
            print(f"📥 导入了 {imported} 条到数据库")
    
    print("\n🎉 OPUS语料库数据处理完成！")
    print("\n📊 数据统计：")
    for lang in languages:
        print(f"  - {lang['name']} ({lang['code']}): {stats.get(lang['code'], 0)} 条")
    print(f"  - 总计: {total_entries} 条")
    
    print("\n📁 数据来源：OPUS多语言语料库 (https://opus.nlpl.eu)")
    print("📝 数据类型：平行语料（原文+译文）")

if __name__ == '__main__':
    main()