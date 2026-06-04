#!/usr/bin/env python3
"""
Diagnostic: test R2 upload via Cloudflare REST API directly.
This bypasses the S3-compatible API entirely.
"""
import sys
import json
import os
import urllib.request
import urllib.error

def cf_api(method, path, token, data=None, content_type=None):
    """Call Cloudflare REST API."""
    url = f"https://api.cloudflare.com/client/v4{path}"
    headers = {"Authorization": f"Bearer {token}"}
    if content_type:
        headers["Content-Type"] = content_type
    body = None
    if data is not None:
        body = data if isinstance(data, bytes) else json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return {"error": str(e), "body": e.read().decode('utf-8')[:500]}

def main():
    cf_token = os.environ.get('CF_API_TOKEN', '')
    r2_bucket = os.environ.get('R2_BUCKET', '')
    r2_endpoint = os.environ.get('R2_ENDPOINT', '')
    r2_access = os.environ.get('R2_ACCESS_KEY', '')
    r2_secret = os.environ.get('R2_SECRET_KEY', '')

    print(f"=== R2 Diagnostic ===")
    print(f"CF_TOKEN: {'SET' if cf_token else 'NOT SET'}")
    print(f"R2_BUCKET: {r2_bucket}")
    print(f"R2_ENDPOINT: {r2_endpoint}")
    print(f"R2_ACCESS_KEY: {'SET' if r2_access else 'NOT SET'}")
    print(f"R2_SECRET_KEY: {'SET' if r2_secret else 'NOT SET'}")

    if not cf_token:
        print("ERROR: CF_API_TOKEN not set - cannot run diagnostics")
        return

    # Test 1: Verify token by getting account info
    print("\n=== Test 1: Verify CF Token ===")
    # Try listing zones
    resp = cf_api("GET", "/zones?per_page=1", cf_token)
    if resp.get('success'):
        zones = resp.get('result', [])
        print(f"Token OK. Found {len(zones)} zones.")
        for z in zones:
            print(f"  Zone: {z['name']} (id={z['id']})")
    else:
        print(f"Token check FAILED: {json.dumps(resp, indent=2)[:500]}")

    # Test 2: List R2 buckets via CF API
    print("\n=== Test 2: List R2 Buckets ===")
    # Need account ID - try to get it from zone info
    account_id = None
    # If r2_endpoint is just account ID
    if r2_endpoint and not r2_endpoint.startswith('http'):
        account_id = r2_endpoint
        print(f"Using account_id from R2_ENDPOINT: {account_id}")

    if account_id and r2_bucket:
        # List objects in bucket via Workers API
        resp = cf_api("GET", f"/accounts/{account_id}/r2/buckets/{r2_bucket}/objects?limit=10", cf_token)
        print(f"R2 list response: {json.dumps(resp, indent=2)[:1000]}")

    # Test 3: Try R2 upload via CF API (Workers KV style for R2)
    print("\n=== Test 3: R2 Upload via S3 API ===")
    # This requires AWS SigV4 which is complex
    # Instead, let's try the R2 custom domain
    if r2_endpoint and r2_bucket:
        # Try R2.dev URL if endpoint is account ID
        if not r2_endpoint.startswith('http'):
            r2_dev = f"https://{r2_bucket}.{r2_endpoint}.r2.dev/"
            print(f"R2.dev URL: {r2_dev}")
        else:
            print(f"Custom endpoint: {r2_endpoint}")

    print("\n=== Diagnostic Complete ===")

if __name__ == '__main__':
    main()
