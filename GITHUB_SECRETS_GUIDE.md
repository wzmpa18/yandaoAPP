# GitHub Actions Secrets 配置指南
# 仓库: https://github.com/wzmpa18/yandaoAPP
# 路径: Settings → Secrets and variables → Actions

## ✅ 你已配置的 Secrets（全部就绪！）

| Secret 名称 | 用途 | 状态 |
|-------------|------|------|
| `APPLE_ISSUER_ID` | Apple 开发者 Issuer ID | ✅ |
| `APPLE_KEY_ID` | Apple 签名密钥 ID | ✅ |
| `APPLE_PB_PRIVATE_KEY` | Apple .p12 私钥 (base64) | ✅ |
| `APPLE_TEAM_ID` | Apple 团队 ID | ✅ |
| `CF_API_TOKEN` | Cloudflare API Token | ✅ |
| `DOUBAO_API_KEY` | 火山引擎 AI API Key | ✅ |
| `KEYCHAIN_PASSWORD` | macOS Keychain 密码 | ✅ |
| `R2_ACCESS_KEY` | Cloudflare R2 Access Key | ✅ |
| `R2_BUCKET` | R2 存储桶名称 | ✅ |
| `R2_ENDPOINT` | R2 Account ID (= CF_ACCOUNT_ID) | ✅ |
| `R2_SECRET_KEY` | R2 Secret Key | ✅ |
| `SUPABASE_SERVICE_KEY` | Supabase 服务密钥 | ✅ |

## Workflow 使用的 Secret 映射:

| Workflow 引用 | 对应你的 Secret |
|---------------|-----------------|
| `${{ secrets.R2_ENDPOINT }}` | → `R2_ENDPOINT` (CF Account ID) |
| `${{ secrets.R2_ACCESS_KEY }}` | → `R2_ACCESS_KEY` |
| `${{ secrets.R2_SECRET_KEY }}` | → `R2_SECRET_KEY` |
| `${{ secrets.R2_BUCKET }}` | → `R2_BUCKET` |
| `${{ secrets.CF_API_TOKEN }}` | → `CF_API_TOKEN` |
| `${{ secrets.APPLE_TEAM_ID }}` | → `APPLE_TEAM_ID` |
| `${{ secrets.APPLE_ISSUER_ID }}` | → `APPLE_ISSUER_ID` |
| `${{ secrets.APPLE_KEY_ID }}` | → `APPLE_KEY_ID` |
| `${{ secrets.APPLE_PB_PRIVATE_KEY }}` | → `APPLE_PB_PRIVATE_KEY` |
| `${{ secrets.KEYCHAIN_PASSWORD }}` | → `KEYCHAIN_PASSWORD` |
| `${{ secrets.SUPABASE_SERVICE_KEY }}` | → `SUPABASE_SERVICE_KEY` |

## 触发构建（二选一）

### 方式1：推送代码自动触发
```bash
git add .
git commit -m "feat: 完整配置 AI接入 + GitHub Actions + iOS/Android打包"
git push origin main
```

### 方式2：手动触发
1. 打开 https://github.com/wzmpa18/yandaoAPP/actions
2. 点击 "Build & Deploy" workflow
3. 点击 "Run workflow" → 选择 main 分支 → Run

## 构建产物下载位置:
- **Android APK**: Actions → 最新运行 → Artifacts → `yandao-android-release.apk`
- **iOS IPA**: 同上 → `yandao-ios-release.zip`
- **R2 存储**: https://10d815d2a0718caa6d0fa86a79c244c8.r2.cloudflarestorage.com/yandao-app-assets/android/
