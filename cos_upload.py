#!/usr/bin/env python3
"""
COS Upload Script - Tencent Cloud COS SDK
上传文件到腾讯云 COS 存储桶

用法:
  python3 cos_upload.py                    # 上传 dist/ 目录
  python3 cos_upload.py /path/to/dir       # 上传指定目录
  python3 cos_upload.py file.html key       # 上传单个文件

环境变量:
  COS_SECRET_ID    - 腾讯云 SecretId
  COS_SECRET_KEY   - 腾讯云 SecretKey
  COS_BUCKET       - COS 存储桶名称 (默认: yandao-1300262413)
  COS_REGION       - COS 所属地区 (默认: ap-guangzhou)
  COS_SOURCE_DIR   - 源目录 (默认: dist)
"""

import os
import sys
import time
from pathlib import Path

try:
    from qcloud_cos import CosConfig, CosS3Client
except ImportError:
    print("[SETUP] Installing cos-python-sdk-v5...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "cos-python-sdk-v5", "-q"])
    from qcloud_cos import CosConfig, CosS3Client

# ============ 配置 ============
SECRET_ID = os.environ.get("COS_SECRET_ID", "")
SECRET_KEY = os.environ.get("COS_SECRET_KEY", "")
BUCKET = os.environ.get("COS_BUCKET", "yandao-1300262413")
REGION = os.environ.get("COS_REGION", "ap-guangzhou")
SOURCE_DIR = os.environ.get("COS_SOURCE_DIR", "dist")

# Content-Type 映射表
MIME_MAP = {
    '.html': 'text/html; charset=utf-8',
    '.htm': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.eot': 'application/vnd.ms-fontobject',
    '.map': 'application/json',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml',
    '.pdf': 'application/pdf',
}

# HTML 文件不缓存，其他文件缓存 1 小时
CACHE_HTML = 'no-cache, no-store, must-revalidate'
CACHE_STATIC = 'public, max-age=3600'


def get_content_type(filepath):
    ext = Path(filepath).suffix.lower()
    content_type = MIME_MAP.get(ext)
    if content_type:
        return content_type
    import mimetypes
    return mimetypes.guess_type(filepath)[0] or 'application/octet-stream'


def get_cache_control(filepath):
    ext = Path(filepath).suffix.lower()
    if ext in ('.html', '.htm'):
        return CACHE_HTML
    return CACHE_STATIC


def upload_file(client, local_path, cos_key):
    """上传单个文件到 COS"""
    content_type = get_content_type(local_path)
    cache_control = get_cache_control(local_path)

    try:
        client.put_object_from_local_file(
            Bucket=BUCKET,
            LocalFilePath=str(local_path),
            Key=cos_key,
            ContentType=content_type,
            CacheControl=cache_control,
        )
        file_size = os.path.getsize(local_path)
        return True, f"{file_size:,}B, {content_type}"
    except Exception as e:
        return False, str(e)[:200]


def upload_directory(client, source_dir):
    """上传整个目录到 COS"""
    source = Path(source_dir).resolve()

    if not source.exists():
        print(f"[ERROR] Source directory not found: {source}")
        sys.exit(1)

    if not source.is_dir():
        print(f"[ERROR] Not a directory: {source}")
        sys.exit(1)

    files = [f for f in source.rglob('*') if f.is_file()]
    total = len(files)

    if total == 0:
        print(f"[WARN] No files found in {source}")
        return

    print(f"[INFO] Uploading {total} files from {source}")
    print(f"[INFO] Bucket: {BUCKET} | Region: {REGION}")
    print(f"[INFO] Target URL: https://{BUCKET}.cos.{REGION}.myqcloud.com/")
    print("-" * 60)

    ok = 0
    fail = 0
    total_size = 0
    failed_files = []

    for i, fpath in enumerate(files, 1):
        rel_path = str(fpath.relative_to(source)).replace('\\', '/')
        file_size = fpath.stat().st_size
        total_size += file_size

        success, msg = upload_file(client, fpath, rel_path)

        if success:
            ok += 1
            print(f"  [{i:>{len(str(total))}}/{total}] OK  {rel_path} ({file_size:,}B)")
        else:
            fail += 1
            failed_files.append((rel_path, msg))
            print(f"  [{i:>{len(str(total))}}/{total}] FAIL {rel_path} - {msg}")

    print("-" * 60)
    print(f"DONE: {ok} uploaded, {fail} failed, {total_size:,} bytes ({total_size/1024:.1f}KB)")

    if fail > 0:
        print(f"\n[ERROR] {fail} files failed:")
        for name, err in failed_files[:5]:
            print(f"  - {name}: {err}")
        sys.exit(1)


def verify_upload(client):
    """验证 COS 上的关键文件"""
    print("\n[VERIFY] Checking uploaded files on COS...")
    for check_key in ['index.html', 'build-verifier.txt']:
        try:
            resp = client.head_object(Bucket=BUCKET, Key=check_key)
            print(f"[OK] {check_key} exists (size={resp.get('Content-Length', '?')}B)")
        except Exception as e:
            print(f"[FAIL] {check_key} NOT found: {e}")


def main():
    print("=" * 60)
    print(f"Tencent COS Upload Tool")
    print(f"Bucket: {BUCKET} | Region: {REGION}")
    print("=" * 60)

    # Validate credentials
    if not SECRET_ID:
        print("[ERROR] COS_SECRET_ID not set!")
        sys.exit(1)
    if not SECRET_KEY:
        print("[ERROR] COS_SECRET_KEY not set!")
        sys.exit(1)

    # Init COS client
    config = CosConfig(Region=REGION, SecretId=SECRET_ID, SecretKey=SECRET_KEY)
    client = CosS3Client(config)
    
    # Test connectivity
    try:
        client.head_bucket(Bucket=BUCKET)
        print(f"[OK] Connected to bucket {BUCKET} in {REGION}")
    except Exception as e:
        print(f"[WARN] Could not access bucket: {e}")
        print("  Continuing anyway (upload will verify permissions)...")

    start_time = time.time()

    if len(sys.argv) >= 3 and Path(sys.argv[1]).is_file():
        # Single file mode
        filepath = sys.argv[1]
        obj_key = sys.argv[2]
        print(f"[MODE] Single file: {filepath} -> {obj_key}")
        success, msg = upload_file(client, Path(filepath), obj_key)
        if success:
            print(f"[OK] Uploaded: {obj_key} ({msg})")
        else:
            print(f"[FAIL] {obj_key} - {msg}")
            sys.exit(1)
    else:
        # Directory mode
        src = sys.argv[1] if len(sys.argv) > 1 else SOURCE_DIR
        upload_directory(client, src)

    elapsed = time.time() - start_time
    print(f"\n[TIME] Total: {elapsed:.1f}s")

    # Verification
    verify_upload(client)

    print("\n[DONE] All operations complete!")


if __name__ == '__main__':
    main()
