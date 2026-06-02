# GitHub Actions iOS 构建配置指南

## 配置步骤

### 1. 获取 Apple API 密钥

在 Apple Developer Portal 创建 API 密钥：

1. 访问 [Apple Developer Portal](https://developer.apple.com/account/resources/authkeys/list)
2. 创建新的密钥（Key Type: App Store Connect API）
3. 下载 `.p8` 私钥文件
4. 记录以下信息：
   - **Key ID**: 密钥标识符
   - **Issuer ID**: 发行者ID（在 Keys 页面顶部）
   - **Team ID**: 团队ID（WM586465ZD）

### 2. 在 GitHub 仓库配置 Secrets

进入 GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret

添加以下 secrets：

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `APPLE_P8_PRIVATE_KEY` | .p8 文件内容（去除换行） | `-----BEGIN PRIVATE KEY-----\nMIIEv...` |
| `APPLE_KEY_ID` | 密钥ID | `ABC123DEF4` |
| `APPLE_ISSUER_ID` | 发行者ID | `00000000-0000-0000-0000-000000000000` |
| `APPLE_TEAM_ID` | 团队ID | `WM586465ZD` |
| `KEYCHAIN_PASSWORD` | 临时钥匙串密码 | `your-secure-password` |
| `R2_ACCESS_KEY` | Cloudflare R2 Access Key | `88f6a8b0b359c64c7c0ca30f8be56c58` |
| `R2_SECRET_KEY` | Cloudflare R2 Secret Key | `f094837ebff96161e5af4fbb7aec5d58...` |
| `R2_BUCKET` | R2 存储桶名称 | `youdao-app` |
| `R2_ENDPOINT` | R2 端点 URL | `https://10d815d2a0718caa6d0fa86a79c244c8.r2.cloudflarestorage.com` |

### 3. 配置 App Store Connect

1. 创建 App ID: `com.yandao.language`
2. 创建 Ad Hoc 配置文件
3. 确保配置文件名称为：`言道学外语 AdHoc`

### 4. 运行构建

手动触发构建：
- 进入 GitHub 仓库 → Actions → iOS Build with API Key → Run workflow

或者推送代码到 `main` 分支自动触发。

## 输出产物

- **IPA 文件**: 上传到 GitHub Artifacts
- **IPA 文件**: 上传到 Cloudflare R2 存储桶

## 自定义域名配置（可选）

如需配置 `www.yandao.vip` 域名：

1. 在 Cloudflare 中添加域名 `yandao.vip`
2. 配置 DNS 记录指向 R2 存储桶
3. 配置自定义域名绑定

## 环境要求

- macOS 最新版本（GitHub Hosted Runner）
- Xcode 最新版本
- Node.js 20+
- Ruby 3.2+