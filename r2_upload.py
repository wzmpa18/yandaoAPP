#!/usr/bin/env python3
"""
Cloudflare R2 direct upload using boto3/s3 API with verbose logging.
Usage: python3 r2_upload.py <bucket> <endpoint> <access_key> <secret_key> <source_dir>
"""
import sys
import os
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

def main():
    if len(sys.argv) < 6:
        print("Usage: r2_upload.py <bucket> <endpoint> <access_key> <secret_key> <source_dir>")
        sys.exit(1)

    bucket = sys.argv[1]
    endpoint = sys.argv[2]
    access_key = sys.argv[3]
    secret_key = sys.argv[4]
    source_dir = sys.argv[5]

    # Fix endpoint if it's just an account ID
    if not endpoint.startswith('http'):
        endpoint = f'https://{endpoint}.r2.cloudflarestorage.com'

    print(f"=== R2 Upload Script ===")
    print(f"Bucket: {bucket}")
    print(f"Endpoint: {endpoint}")
    print(f"Source: {source_dir}")
    print(f"Access Key: {access_key[:8]}...")

    # Create S3 client
    s3 = boto3.client(
        's3',
        endpoint_url=endpoint,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name='auto',
        config=Config(
            signature_version='s3v4',
            retries={'max_attempts': 3, 'mode': 'standard'},
        )
    )

    # Test 1: List bucket
    print("\n=== Test 1: List bucket ===")
    try:
        resp = s3.list_objects_v2(Bucket=bucket, MaxKeys=5)
        print(f"Status: OK, {resp.get('KeyCount', 0)} objects")
        for obj in resp.get('Contents', []):
            print(f"  - {obj['Key']} ({obj['Size']} bytes, {obj['LastModified']})")
    except ClientError as e:
        print(f"ERROR: {e}")

    # Test 2: Write test file
    print("\n=== Test 2: Write test file ===")
    import time
    test_content = f"test_{int(time.time())}"
    try:
        s3.put_object(
            Bucket=bucket,
            Key='r2_test_upload.txt',
            Body=test_content.encode('utf-8'),
            ContentType='text/plain',
        )
        print(f"OK: Wrote r2_test_upload.txt")

        # Verify
        resp = s3.get_object(Bucket=bucket, Key='r2_test_upload.txt')
        content = resp['Body'].read().decode('utf-8')
        print(f"Verify: Content='{content}'")
    except ClientError as e:
        print(f"ERROR: {e}")

    # Test 3: Upload all files from source_dir
    print(f"\n=== Test 3: Upload files from {source_dir} ===")
    if not os.path.isdir(source_dir):
        print(f"ERROR: {source_dir} is not a directory!")
        return

    content_types = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.txt': 'text/plain; charset=utf-8',
    }

    uploaded = 0
    failed = 0
    for root, dirs, files in os.walk(source_dir):
        for fname in files:
            fpath = os.path.join(root, fname)
            r2key = os.path.relpath(fpath, source_dir).replace('\\', '/')
            ext = os.path.splitext(fname)[1].lower()
            ct = content_types.get(ext, 'application/octet-stream')

            try:
                # Delete first to force overwrite
                try:
                    s3.delete_object(Bucket=bucket, Key=r2key)
                except:
                    pass

                s3.upload_file(
                    fpath, bucket, r2key,
                    ExtraArgs={
                        'ContentType': ct,
                        'CacheControl': 'no-cache, no-store, must-revalidate',
                    }
                )
                print(f"  OK: {r2key} ({ct})")
                uploaded += 1
            except ClientError as e:
                print(f"  FAIL: {r2key} - {e}")
                failed += 1

    print(f"\n=== Summary: {uploaded} uploaded, {failed} failed ===")

    # Test 4: Verify index.html
    print("\n=== Test 4: Verify index.html ===")
    try:
        resp = s3.get_object(Bucket=bucket, Key='index.html')
        content = resp['Body'].read().decode('utf-8')[:300]
        print(f"index.html ({resp['ContentLength']} bytes):")
        print(content)
    except ClientError as e:
        print(f"ERROR: {e}")

    # Test 5: Verify build-verifier.txt
    print("\n=== Test 5: Verify build-verifier.txt ===")
    try:
        resp = s3.get_object(Bucket=bucket, Key='build-verifier.txt')
        content = resp['Body'].read().decode('utf-8').strip()
        print(f"build-verifier.txt: {content}")
    except ClientError as e:
        print(f"ERROR: {e}")


if __name__ == '__main__':
    main()
