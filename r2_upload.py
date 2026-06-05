#!/usr/bin/env python3
"""
R2 Upload Script - Cloudflare REST API 版本
无需 boto3，无需 S3 凭证，仅需 R2_API_TOKEN
上传文件到 R2 存储桶并通过自定义域名访问

用法:
  python3 r2_upload.py                    # 上传 dist/ 目录
  python3 r2_upload.py /path/to/dir       # 上传指定目录
  python3 r2_upload.py file.html key       # 上传单个文件

环境变量:
  R2_ACCOUNT_ID    - Cloudflare Account ID (默认: 10d815d2a0718caa6d0fa86a79c244c8)
  R2_BUCKET        - R2 存储桶名称 (默认: youdao-app)
  R2_API_TOKEN     - Cloudflare API Token (必须有 R2 对象读写权限)
  R2_SOURCE_DIR    - 源目录 (默认: dist)
"""

import os
import sys
import json
import mimetypes
import time
import urllib.request
import urllib.error
from pathlib import Path

# ============ 默认配置 ============
ACCOUNT_ID = os.environ.get("R2_ACCOUNT_ID", "10d815d2a0718caa6d0fa86a79c244c8")
BUCKET_NAME = os.environ.get("R2_BUCKET", "youdao-app")
API_TOKEN = os.environ.get("R2_API_TOKEN", "")
SOURCE_DIR = os.environ.get("R2_SOURCE_DIR", "dist")

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

# API 基础 URL
API_BASE = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET_NAME}/objects"


def get_content_type(filepath):
    """根据扩展名获取 Content-Type"""
    ext = Path(filepath).suffix.lower()
    return MIME_MAP.get(ext, mimetypes.guess_type(filepath)[0] or 'application/octet-stream')


def api_request(method, url, token, data=None, content_type=None):
    """发送 Cloudflare API 请求"""
    headers = {"Authorization": f"Bearer {token}"}
    if content_type:
        headers["Content-Type"] = content_type
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read()
            return resp.status, body
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def upload_object(object_key, file_data, token):
    """上传单个对象到 R2"""
    encoded_key = urllib.request.quote(object_key, safe="/")
    url = f"{API_BASE}/{encoded_key}"
    ct = get_content_type(object_key)

    status, body = api_request("PUT", url, token, data=file_data, content_type=ct)
    if status == 200 or status == 204:
        return True, f"{len(file_data)} bytes"
    else:
        error_text = body.decode('utf-8', errors='replace')[:300]
        return False, f"HTTP {status}: {error_text}"


def delete_object(object_key, token):
    """删除 R2 中的对象"""
    encoded_key = urllib.request.quote(object_key, safe="/")
    url = f"{API_BASE}/{encoded_key}"
    status, _ = api_request("DELETE", url, token)
    # 404 means already gone, that's fine
    return status in (200, 204, 404)


def list_objects(token, prefix="", max_keys=20):
    """列出 R2 中的对象"""
    params = f"?max_keys={max_keys}"
    if prefix:
        params += f"&prefix={urllib.request.quote(prefix)}"
    url = f"{API_BASE}{params}"
    status, body = api_request("GET", url, token)
    if status == 200:
        return json.loads(body)
    return None


def upload_directory(source_dir, token):
    """上传整个目录到 R2"""
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

    print(f"[INFO] Uploading {total} files from {source} to R2 bucket '{BUCKET_NAME}'")
    print(f"[INFO] Account: {ACCOUNT_ID}")
    print("-" * 60)

    ok = 0
    fail = 0
    total_size = 0

    for i, fpath in enumerate(files, 1):
        # 计算相对路径作为 object key
        rel_path = str(fpath.relative_to(source)).replace('\\', '/')
        file_size = fpath.stat().st_size
        total_size += file_size

        with open(fpath, 'rb') as f:
            file_data = f.read()

        # 先删除再上传（确保覆盖旧文件）
        delete_object(rel_path, token)

        success, msg = upload_object(rel_path, file_data, token)

        if success:
            ok += 1
            ct = get_content_type(str(fpath))
            print(f"  [{i:>{len(str(total))}}/{total}] OK  {rel_path} ({file_size:,}B, {ct})")
        else:
            fail += 1
            print(f"  [{i:>{len(str(total))}}/{total}] FAIL {rel_path} - {msg}")

    print("-" * 60)
    print(f"DONE: {ok} uploaded, {fail} failed, {total_size:,} bytes total ({total_size/1024:.1f}KB)")
    
    if fail > 0:
        print("[ERROR] Some uploads failed!")
        sys.exit(1)


def verify_upload(token):
    """验证 R2 上的文件"""
    print("\n[VERIFY] Checking R2 bucket contents...")
    result = list_objects(token, max_keys=10)
    if result and result.get('success'):
        objects = result.get('result', [])
        if objects:
            print(f"[OK] Found {len(objects)} objects in bucket:")
            for obj in objects[:10]:
                size = obj.get('size', '?')
                key = obj.get('key', '?')
                modified = obj.get('last_modified', '?')
                print(f"      {key} ({size}B, {modified})")
            if len(objects) > 10:
                print(f"      ... and {len(objects)-10} more")
        else:
            print("[WARN] Bucket appears empty!")
    else:
        print(f"[WARN] Could not list bucket: {result}")

    # Check specific files
    for check_key in ['index.html', 'build-verifier.txt']:
        encoded = urllib.request.quote(check_key, safe="/")
        url = f"{API_BASE}/{encoded}"
        status, body = api_request("HEAD", url, token)
        if status in (200, 204):
            print(f"[OK] {check_key} exists on R2 (status={status})")
        else:
            print(f"[FAIL] {check_key} NOT found on R2 (status={status})")


def main():
    print("=" * 60)
    print(f"R2 Upload Tool | Bucket: {BUCKET_NAME}")
    print(f"Account: {ACCOUNT_ID} | Source: {SOURCE_DIR}")
    print("=" * 60)

    if not API_TOKEN:
        print("[ERROR] R2_API_TOKEN not set!")
        print("  Set it as environment variable or pass via --token")
        sys.exit(1)

    start_time = time.time()

    if len(sys.argv) >= 3 and Path(sys.argv[1]).is_file():
        # Single file mode: r2_upload.py <file> <key>
        filepath = sys.argv[1]
        obj_key = sys.argv[2]
        print(f"[MODE] Single file: {filepath} -> {obj_key}")
        with open(filepath, 'rb') as f:
            data = f.read()
        ok, msg = upload_object(obj_key, data, API_TOKEN)
        if ok:
            print(f"[OK] Uploaded: {obj_key} ({msg})")
        else:
            print(f"[FAIL] {obj_key} - {msg}")
            sys.exit(1)
    else:
        # Directory mode
        src = sys.argv[1] if len(sys.argv) > 1 else SOURCE_DIR
        upload_directory(src, API_TOKEN)

    elapsed = time.time() - start_time
    print(f"\n[TIME] Total: {elapsed:.1f}s")

    # Verification
    verify_upload(API_TOKEN)

    print("\n[DONE] All operations complete!")


if __name__ == '__main__':
    main()
