# 言道 (Gendou) — 项目完整说明书

> 版本：v5.1.0 · 最后更新：2026-05-24

---

## 目录

1. [项目概述](#1-项目概述)
2. [已实现功能清单](#2-已实现功能清单)
3. [技术架构](#3-技术架构)
4. [数据库表说明](#4-数据库表说明)
5. [如何导入 TUFS 词汇数据](#5-如何导入-tufs-词汇数据)
6. [如何部署到服务器](#6-如何部署到服务器)
7. [如何打包成手机 APP](#7-如何打包成手机-app)
8. [创始人后台使用指南](#8-创始人后台使用指南)
9. [付费与变现体系](#9-付费与变现体系)
10. [当前已知问题与后续建议](#10-当前已知问题与后续建议)
11. [环境变量配置](#11-环境变量配置)

---

## 1. 项目概述

**言道 (Gendou)** 是一款面向全球用户的多语言学习平台，支持 10 种目标语言，界面可切换 7 种母语显示。核心定位是"社交 + 游戏化 + AI 陪练"三合一的语言学习超级平台。

**核心特点：**
- 支持 10 种目标语言：日语、英语、韩语、法语、西班牙语、德语、意大利语、葡萄牙语、阿拉伯语、中文进阶
- 界面支持 7 种母语：中文、英语、日语、韩语、法语、西班牙语、德语
- 游戏化学习（7 种游戏模式 + 多人对战）
- AI 助手（4 种角色陪练 + 拍照解题 + 语音问答）
- 语伴匹配（双向互教系统）
- 虚拟电台（5 种内容类型 + 跟读评分）
- 付费变现（VIP 订阅 + 单次购买 + 语言包 + 商家入驻）
- 邀请裂变（推荐收益 + 钻石会员）
- 完善的隐私控制与用户管理

---

## 2. 已实现功能清单

### 2.1 用户引导（Onboarding）
- [x] 母语/界面语言选择（7 种）
- [x] 目标语言选择（10 种）
- [x] 学习目标选择（日常口语 / 备考冲刺 / 职业提升）
- [x] 年龄段选择（中小学 / 大学 / 职业 / 专业人士）
- [x] 兴趣标签选择（动漫、游戏、体育、音乐、科技等）
- [x] 水平测试（零基础直接入门 / 测试分级入场）
- [x] 10 题语音测评 + 口语评分
- [x] 手机号验证（可跳过）

### 2.2 主页路径（学习路线）
- [x] 每日打卡系统（获得 XP + 连续天数）
- [x] 学习心情记录
- [x] 5 个功能快捷入口（游戏场 / 语法词汇 / 电台 / 语伴 / 会员）
- [x] 情景对话 + 语法模块预览

### 2.3 游戏场（GameArena）
- [x] 7 种游戏模式：
  - 连线消消乐（Word Match）
  - 拼图连词成句（Sentence Builder）
  - 单词猎人（Word Hunter）
  - 语法魔方（Grammar Cube）
  - 密室逃脱（Escape Room）
  - 语法星球（Grammar Planet）
  - 语伴对话（Buddy Chat）
- [x] 爱心（生命值）系统：答错扣心，邀请好友补血
- [x] 每日挑战（每语言每天一套）
- [x] 赛季积分榜（段位系统）
- [x] 多人匹配房间（PK 模式 / 协作模式）
- [x] XP 经验值累积

### 2.4 语法词汇（GrammarVocab）
- [x] 考试靶向（ExamTargetTab）：按 JLPT/TOPIK/DELF/DELE/CET/Goethe 等考试体系筛题
- [x] 记忆工坊（MnemonicTab）：谐音记忆法 + 记忆宫殿
- [x] 大咖秘籍（MasterTipsTab）：社区分享 + 点赞排名
- [x] 教材同步（TextbookTab）：与主流教材单元对应
- [x] 错题本（WrongAnswersTab）：错误追踪 + 针对性复习

### 2.5 AI 助手（AIAssistant）
- [x] 4 个模式：
  - 拍照解题（CameraAI 识别图片文字）
  - 语音问答（语音识别 + TTS 播报）
  - 文字问答（语法解析 / 词汇查询 / 翻译纠错）
  - 陪伴聊天（4 种 AI 角色：熊猫老师 / 傲娇同学 / 段子手 / 暖心姐）
- [x] 长期记忆（AI 记住用户名字和偏好）
- [x] 目标语言联动（切换语言对话重置）

### 2.6 虚拟电台（VirtualRadio）
- [x] 5 种内容类型：新闻 / 音乐 / 故事 / 商业 / 学术
- [x] 职业定制内容（金融 / 医疗 / 科技 / 法律等）
- [x] 跟读模式（录音 + 发音评分）
- [x] 速度调节（0.5x / 1x / 1.25x / 1.5x / 2x）
- [x] 单曲循环 / 自动下一条

### 2.7 语伴匹配（PartnerHub）
- [x] 智能匹配（互补语言 + 兴趣 + 活跃度）
- [x] 在线状态显示
- [x] 匹配互动积分（纠正对方 +5 分 / 被纠正 +5 分 / 对话 +10 分）
- [x] 付费扩充语伴槽位（¥0.49/个，永久）

### 2.8 学习圈（StudyCircle）
- [x] 创建 / 加入学习群组（4 种规格）
- [x] 群组保证金制度（防止解散）
- [x] 商城功能（群内贩卖学习资料）
- [x] 成员管理（踢人 / 转让群主）

### 2.9 个人中心（ProfilePanel）
- [x] 邀请码系统 + 收益看板
- [x] 提现功能（USDT / 支付宝）
- [x] 主题皮肤切换（5 种：国风 / 墨韵 / 枯山水 / 极简 / 暗夜）
- [x] 界面语言切换（7 种母语，即时生效）
- [x] 隐私设置（5 个开关，一键暂停陌生互动）
- [x] 经验值 / 连续天数 / 钻石显示
- [x] 荣誉墙（7 个成就徽章）
- [x] 重置问卷

### 2.10 付费系统（PaywallModal / CheckoutModal）
- [x] 4 个付费节点：
  - VIP 月会员（$3.9 或 ¥28）
  - 单次考试机会（$0.99 或 ¥7）
  - AI 语音评测次数（$0.2 或 ¥1.5）
  - 永久语伴槽位（$0.49 或 ¥3.5）
  - 永久语言包（$1.9 或 ¥14，VIP 享 8 折）
- [x] 多货币支持（CNY / USD / JPY / KRW / EUR）
- [x] Stripe Webhook 接入（待正式 API Key 激活）

### 2.11 商家系统（MerchantHub）
- [x] 商家入驻申请（资质审核流程）
- [x] 广告投放（按语言/地区/活跃度定向）
- [x] 曝光记录追踪

### 2.12 界面多语言（i18n）
- [x] 7 种界面语言完整翻译（60+ 字符串键）
- [x] 注册时选择母语
- [x] 个人中心随时切换，即时生效
- [x] 学习内容（词卡/题目/对话）始终显示目标语言，不受影响

### 2.13 内容语言联动
- [x] 切换目标语言时自动清除旧语言内容残留
- [x] 所有内容模块（游戏/AI/电台/语法/考题）切换后立即重载

---

## 3. 技术架构

```
前端框架:   React 18 + TypeScript + Vite 5
样式系统:   Tailwind CSS + 自定义 CSS 变量（主题系统）
图标库:     Lucide React
数据库:     Supabase (PostgreSQL + Row Level Security)
实时功能:   Supabase Realtime（预留）
支付:       Stripe Webhooks（Edge Function）
汇率:       Exchange Rates API（Edge Function）
语音:       Web Speech API（SpeechRecognition + SpeechSynthesis）
部署:       Vite 静态构建 → Vercel / Netlify / Nginx
APP:        Capacitor 或 PWA 封装
```

### 目录结构

```
src/
├── App.tsx                    # 入口，session 管理，UILanguageProvider
├── main.tsx                   # ReactDOM 挂载
├── index.css                  # 全局样式 + 主题变量
├── components/
│   ├── MainHub.tsx            # 主导航枢纽（所有视图切换）
│   ├── Onboarding.tsx         # 注册引导（含 UserProfile 类型定义）
│   ├── GameArena.tsx          # 游戏场容器
│   ├── games/                 # 7 种游戏实现
│   │   ├── WordHunter.tsx
│   │   ├── GrammarCube.tsx
│   │   ├── GrammarPlanet.tsx
│   │   ├── EscapeRoom.tsx
│   │   └── BuddyChat.tsx
│   ├── GrammarVocab.tsx       # 语法词汇容器
│   ├── gv/                    # 5 个 GrammarVocab 子标签
│   │   ├── ExamTargetTab.tsx
│   │   ├── MnemonicTab.tsx
│   │   ├── MasterTipsTab.tsx
│   │   ├── TextbookTab.tsx
│   │   └── WrongAnswersTab.tsx
│   ├── AIAssistant.tsx        # AI 助手（4 模式）
│   ├── CameraAI.tsx           # 拍照解题
│   ├── AudioShadow.tsx        # 跟读评分组件
│   ├── VirtualRadio.tsx       # 虚拟电台
│   ├── PartnerHub.tsx         # 语伴匹配
│   ├── StudyCircle.tsx        # 学习圈
│   ├── ProfilePanel.tsx       # 个人中心
│   ├── PrivacySettings.tsx    # 隐私设置
│   ├── MemberCenter.tsx       # 会员中心
│   ├── MerchantHub.tsx        # 商家系统
│   ├── ExamEngine.tsx         # 考试引擎
│   ├── DailyCheckin.tsx       # 每日打卡
│   ├── SeasonRanking.tsx      # 赛季积分
│   ├── GroupShop.tsx          # 群组商城
│   ├── Matchmaking.tsx        # 多人匹配房
│   ├── PaywallModal.tsx       # 付费墙
│   ├── CheckoutModal.tsx      # 结账弹窗
│   ├── ThemePicker.tsx        # 主题选择
│   ├── LanguageSelector.tsx   # 目标语言切换器
│   ├── TaijiCompass.tsx       # 太极罗盘动画
│   ├── FlipCard.tsx           # 词卡翻转动画
│   ├── Confetti.tsx           # 庆祝粒子效果
│   ├── FloatingBack.tsx       # 悬浮返回按钮
│   ├── AICoach.tsx            # AI 教练（路径页）
│   ├── TravelTranslator.tsx   # 旅行翻译
│   ├── PhoneVerify.tsx        # 手机验证
│   └── LangPackAdmin.tsx      # 语言包管理（创始人专用）
├── lib/
│   ├── supabase.ts            # Supabase 客户端单例
│   ├── i18n.ts                # 7 种界面语言翻译字典
│   ├── UILanguageContext.tsx  # React Context + useUI() 钩子
│   ├── featureGate.ts         # 付费功能访问控制
│   ├── theme.ts               # 主题系统
│   ├── useAudio.ts            # 音频播放 Hook
│   ├── InfiniteGameGenerator.ts  # 无限游戏题目生成
│   ├── MatchmakingSystem.ts   # 语伴匹配算法
│   └── smartContentGenerator.ts  # 智能内容生成
├── data/
│   ├── languages.ts           # 10 种目标语言配置
│   └── dynamic_content.json   # 动态内容种子数据
supabase/
├── migrations/                # 18 个数据库迁移文件
└── functions/
    ├── exchange-rates/        # 汇率查询 Edge Function
    └── stripe-webhook/        # Stripe 支付回调 Edge Function
```

---

## 4. 数据库表说明

### 4.1 用户核心表

| 表名 | 说明 |
|------|------|
| `user_profiles` | **最核心表**。存储用户全部信息：session_key、目标语言(language_code)、界面语言(ui_language)、学习目标、等级、测评分、年龄段、兴趣标签、职业、VIP到期时间、各功能免费额度、已购语言包、Stripe客户ID、手机号、主题偏好 |
| `user_phone_verifications` | 手机号验证记录（code + 过期时间） |
| `user_learning_daily` | 每日打卡记录（日期 + 语言 + 获得XP） |
| `user_privacy_settings` | 隐私开关（5个可配置项 + 一键暂停功能） |

### 4.2 学习内容表

| 表名 | 说明 |
|------|------|
| `vocabulary_items` | 词汇库。字段：lang_code、word、meaning、reading（读音）、part_of_speech、level(1-3)、example_sentence。当前约 3000+ 条（10语言）。支持导入 TUFS 数据扩展到每语言 3000 词 |
| `grammar_patterns` | 语法规则库。字段：lang_code、pattern_text、explanation、example、category、level。当前约 350 条（10语言 × 35条） |
| `exam_questions` | 考题库。字段：language_code、question_type(choice/fill/match/reorder)、difficulty(beginner/intermediate/advanced)、question、options(json)、correct_answer、explanation、topic_tag。当前数量见数据库 |
| `exam_targets` | 考试体系配置（JLPT N1-N5、TOPIK、DELF、DELE、CET4/6、Goethe 等） |
| `user_exam_goals` | 用户设定的考试目标 |
| `textbook_index` | 教材单元索引（教材名 + 单元 + 语言） |
| `user_textbook_progress` | 用户教材学习进度 |
| `wrong_answers` | 错题本记录（问题 + 答错内容 + 时间） |
| `mnemonics` | 社区记忆法（谐音/图像/故事，支持点赞） |
| `memory_palace_rooms` | 用户记忆宫殿房间 |
| `master_tips` | 大咖秘籍（社区分享 + 打赏系统） |
| `tip_rewards` | 秘籍打赏记录 |

### 4.3 游戏与竞技表

| 表名 | 说明 |
|------|------|
| `game_content_pool` | 游戏题目池（lang_code + game_type + difficulty + content） |
| `game_rooms` | 多人游戏房间（room_code、模式、状态、参与者） |
| `daily_challenges` | 每日挑战（每种语言每天自动生成一套） |
| `seasons` | 赛季配置（开始/结束时间） |
| `season_rankings` | 赛季排行榜（用户 + 语言 + 积分） |

### 4.4 社交与语伴表

| 表名 | 说明 |
|------|------|
| `user_partner_profiles` | 语伴档案（会讲的语言 + 想学的语言 + 在线时间 + 活跃度分） |
| `partner_matches` | 语伴匹配记录（双向，状态：pending/active/ended） |
| `partner_interactions` | 互动积分记录（纠正/被纠正/对话各 +5/+5/+10 分） |
| `study_groups` | 学习圈群组（4 种规格：small 10人/medium 30人/large 100人/VIP 5人）+ 保证金制度 |
| `study_group_members` | 群成员记录 |
| `group_transfer_requests` | 群主转让申请 |

### 4.5 电台内容表

| 表名 | 说明 |
|------|------|
| `radio_content` | 电台内容（lang_code + radio_type + 职业定制内容 + 难度 + 时长 + 逐字稿） |

### 4.6 AI 功能表

| 表名 | 说明 |
|------|------|
| `ai_conversations` | AI 对话历史（4 种角色 × 用户会话） |
| `ai_conversation_memory` | AI 长期记忆（用户名字/偏好/历史摘要） |

### 4.7 商业化表

| 表名 | 说明 |
|------|------|
| `pricing_plans` | 定价计划（多货币：CNY/USD/JPY/KRW/EUR） |
| `user_subscriptions` | 用户订阅记录 |
| `payment_orders` | 支付订单（Stripe 交易 ID + 状态） |
| `platform_configs` | **创始人可调参数**：`exam_free_per_month`（每月免费考试次数）、`ai_speech_free_per_day`（每日免费AI语音次数）、`free_partner_slots`（免费语伴槽位数）等 |
| `referral_earnings` | 邀请裂变收益记录（邀请人 + 被邀请人 + 金额） |
| `platform_wallets` | 用户钱包余额（USDT/CNY） |
| `withdrawals` | 提现申请（pending/approved/rejected/paid） |

### 4.8 商家广告表

| 表名 | 说明 |
|------|------|
| `merchants` | 商家资料（资质 + 审核状态） |
| `ad_campaigns` | 广告活动（定向：目标语言 / 地区 / 用户活跃度 + 预算） |
| `ad_impressions` | 曝光日志 |

### 4.9 学习圈商城表

| 表名 | 说明 |
|------|------|
| `group_products` | 群组内贩卖的学习资料 |
| `group_orders` | 购买记录（含平台抽成比例） |

---

## 5. 如何导入 TUFS 词汇数据

TUFS（东京外国语大学）词汇库包含 23 种语言、每种约 3000 词，可将词汇量从当前的约 500 词/语言扩展到 3000 词。

### 5.1 获取数据

```bash
# 方案 A：直接下载 TSV（推荐，最快）
wget https://raw.githubusercontent.com/omwn/tufs/master/tufs-vocab.tsv

# 方案 B：下载编译好的 SQLite（~40MB）
wget https://omwn.org/tufs/data/tufs.db.gz
# 脚本会自动解压，无需手动 gunzip
```

### 5.2 安装依赖

```bash
pip install supabase
```

### 5.3 运行导入脚本

项目根目录已提供 `import_tufs.py`。

```bash
# 导入全部支持的语言（脚本自动过滤到10种目标语言）
python import_tufs.py \
  --url  https://YOUR_PROJECT.supabase.co \
  --key  YOUR_SERVICE_ROLE_KEY \
  --source ./tufs-vocab.tsv \
  --langs ja,en,ko,fr,es,de,it,pt,ar,zh

# 先 dry-run 预览，不实际写入
python import_tufs.py \
  --url  https://YOUR_PROJECT.supabase.co \
  --key  YOUR_SERVICE_ROLE_KEY \
  --source ./tufs-vocab.tsv \
  --langs ja \
  --dry-run

# 自定义每批数量（默认 100）
python import_tufs.py \
  --url  ... \
  --key  ... \
  --source ./tufs-vocab.tsv \
  --batch 200
```

### 5.4 脚本参数说明

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--url` | Supabase 项目 URL（必填） | — |
| `--key` | Service Role Key（必填，非 anon key） | — |
| `--source` | 数据文件路径（.tsv 或 .db/.db.gz） | `tufs-vocab.tsv` |
| `--langs` | 逗号分隔的语言代码（可选，不填=全部） | 全部 |
| `--batch` | 每批 upsert 条数 | 100 |
| `--dry-run` | 预览模式，不写入数据库 | false |

### 5.5 Service Role Key 获取方式

Supabase 后台 → Project Settings → API → `service_role` (secret)

> **注意：** 不要使用 `anon` key 导入数据，会受 Row Level Security 限制。

### 5.6 导入后验证

```sql
-- 在 Supabase SQL Editor 中执行
SELECT lang_code, COUNT(*) as word_count
FROM vocabulary_items
GROUP BY lang_code
ORDER BY lang_code;
```

---

## 6. 如何部署到服务器

### 6.1 构建生产包

```bash
# 在项目根目录
npm install
npm run build
# 产物在 dist/ 目录
```

### 6.2 方案 A：Vercel（推荐，最简单）

1. 将代码推送到 GitHub 仓库
2. 登录 [vercel.com](https://vercel.com) → New Project → 选择仓库
3. Framework Preset 选 **Vite**
4. 添加环境变量：
   - `VITE_SUPABASE_URL` = 你的 Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = 你的 Anon Key
5. 点击 Deploy

**自动 HTTPS、CDN、CI/CD 全包含，免费套餐足够初期使用。**

### 6.3 方案 B：Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

在 Netlify 控制台设置 `_redirects` 文件（SPA 路由修复）：

```
echo "/* /index.html 200" > dist/_redirects
```

### 6.4 方案 C：Nginx（自托管服务器）

```bash
# 1. 上传 dist/ 内容到服务器
scp -r dist/ user@your-server:/var/www/gendou/

# 2. Nginx 配置
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/gendou;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # SPA 路由
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# 3. 配置 HTTPS（Let's Encrypt）
certbot --nginx -d yourdomain.com
```

### 6.5 Supabase Edge Functions 部署

支付 Webhook 和汇率查询已通过 Supabase Edge Functions 实现，代码在 `supabase/functions/`。每次修改后通过 Supabase CLI 部署：

```bash
# 部署支付 Webhook
supabase functions deploy stripe-webhook

# 部署汇率查询
supabase functions deploy exchange-rates
```

### 6.6 部署检查清单

- [ ] 环境变量配置正确（VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY）
- [ ] Supabase 数据库迁移全部执行（18 个 migration 文件）
- [ ] HTTPS 已启用（Web Speech API 需要 HTTPS）
- [ ] SPA 路由 fallback 配置（所有路径返回 index.html）
- [ ] Stripe Webhook URL 更新为生产域名

---

## 7. 如何打包成手机 APP

### 7.1 方案 A：PWA（最简单，无需上架）

无需代码修改，现有 Web 应用已可作为 PWA 安装到手机桌面。

**用户使用方式：**
1. 手机浏览器打开网站
2. iOS：Safari → 分享 → "添加到主屏幕"
3. Android：Chrome → 菜单 → "添加到主屏幕"

**增强 PWA 体验（可选）：** 在 `public/` 目录添加 `manifest.json`：

```json
{
  "name": "言道 Gendou",
  "short_name": "言道",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F2EFE6",
  "theme_color": "#C9553D",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

在 `index.html` 中引用：
```html
<link rel="manifest" href="/manifest.json">
```

### 7.2 方案 B：Capacitor（原生 APP，可上架 App Store / Google Play）

```bash
# 1. 安装 Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
npx cap init "言道" "com.gendou.app" --web-dir dist

# 2. 构建 Web
npm run build

# 3. 添加平台
npx cap add ios
npx cap add android

# 4. 同步代码
npx cap sync

# 5. 打开 Xcode / Android Studio
npx cap open ios      # iOS
npx cap open android  # Android
```

**iOS 上架所需：**
- Apple Developer 账号（$99/年）
- Xcode（macOS 系统）
- App Store Connect 配置

**Android 上架所需：**
- Google Play Developer 账号（$25 一次性）
- 生成签名 APK/AAB

### 7.3 方案 C：Electron（桌面应用）

```bash
npm install --save-dev electron electron-builder

# 添加 main.js 入口文件和打包配置
# 然后 npm run electron:build
```

### 7.4 注意事项

- **Web Speech API**：原生浏览器 API，在 Capacitor 内嵌浏览器中可用，但部分设备可能受限
- **摄像头权限**（拍照解题）：需在 `capacitor.config.json` 中声明 `Camera` 插件权限
- **存储**：当前使用 `localStorage` + Supabase，Capacitor 下自动兼容

---

## 8. 创始人后台使用指南

### 8.1 激活后台入口

在**个人中心**页面，快速点击底部版本号 **7 次**，弹出密码框。

默认密码：`1991`（可在 `ProfilePanel.tsx` 中修改 `ADMIN_CODE` 常量）

### 8.2 后台功能

激活后台后，个人中心会出现隐藏菜单，可调节：

| 配置项 | 说明 | 默认值 | 范围 |
|--------|------|--------|------|
| 现金奖励（每邀请1人） | 用户成功邀请好友后获得的现金奖励 | $1.0 | $0.5 - $2.0 |
| 广告展示频率 | 每答N题展示一次广告 | 5题/次 | 1-10 |
| 机构合作抽成比例 | 商家广告/课程销售平台抽成 | 20% | 20%-30% |
| 纠正积分 | 语伴纠正对方得分 | 5分 | 可调 |
| 被纠正积分 | 被纠正也得分（激励接受纠正） | 5分 | 可调 |
| 对话积分 | 每次对话得分 | 10分 | 可调 |

### 8.3 数据库级别配置（Supabase SQL Editor）

高级配置需直接操作 `platform_configs` 表：

```sql
-- 查看当前配置
SELECT * FROM platform_configs;

-- 修改每月免费考试次数（默认 2）
UPDATE platform_configs
SET value = '5'
WHERE key = 'exam_free_per_month';

-- 修改每日免费 AI 语音次数（默认 3）
UPDATE platform_configs
SET value = '5'
WHERE key = 'ai_speech_free_per_day';

-- 修改免费语伴槽位数（默认 1）
UPDATE platform_configs
SET value = '2'
WHERE key = 'free_partner_slots';
```

### 8.4 用户管理

```sql
-- 查看所有用户
SELECT session_key, language_code, ui_language, goal, level,
       vip_expiry, created_at
FROM user_profiles
ORDER BY created_at DESC;

-- 手动开通 VIP（30天）
UPDATE user_profiles
SET vip_expiry = now() + interval '30 days'
WHERE session_key = 'sess_xxx_xxx';

-- 查看提现申请（pending 状态）
SELECT * FROM withdrawals WHERE status = 'pending';

-- 处理提现：标记为已支付
UPDATE withdrawals
SET status = 'paid', processed_at = now()
WHERE id = 'xxx-xxx-xxx';
```

### 8.5 群组管理（封禁违规群）

在个人中心后台解锁后，点击"群组管理"按钮可查看所有学习圈群组，可执行封禁操作（保证金没收）。

```sql
-- 数据库直接封禁
UPDATE study_groups
SET status = 'banned',
    banned_at = now(),
    ban_reason = '违规内容',
    deposit_forfeited = true
WHERE id = 'group-uuid-xxx';
```

### 8.6 语言包管理

在个人中心点击"语言包管理"（后台解锁后可见），可为特定语言批量添加词汇包、设置解锁条件。

### 8.7 广告审核（商家）

```sql
-- 查看待审核商家
SELECT * FROM merchants WHERE status = 'pending';

-- 审核通过
UPDATE merchants
SET status = 'approved', approved_at = now()
WHERE id = 'merchant-uuid-xxx';

-- 审核广告活动
SELECT * FROM ad_campaigns WHERE status = 'pending';

UPDATE ad_campaigns
SET status = 'active'
WHERE id = 'campaign-uuid-xxx';
```

### 8.8 收益统计

```sql
-- 平台总收益概览
SELECT
  SUM(amount_fen) / 100.0 AS total_revenue_yuan
FROM payment_orders
WHERE status = 'paid';

-- 按月统计
SELECT
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS orders,
  SUM(amount_fen) / 100.0 AS revenue_yuan
FROM payment_orders
WHERE status = 'paid'
GROUP BY month
ORDER BY month DESC;

-- 邀请裂变效果
SELECT
  COUNT(DISTINCT referrer_session_key) AS active_referrers,
  COUNT(*) AS total_referrals,
  SUM(amount_fen) / 100.0 AS total_paid_out
FROM referral_earnings;
```

---

## 9. 付费与变现体系

### 9.1 付费节点

| 产品 | 美元 | 人民币 | 说明 |
|------|------|--------|------|
| VIP 月会员 | $3.9 | ¥28 | 无广告 + 无限考试 + 无限AI语音 + 无限语伴 + 8折语言包 |
| 单次考试 | $0.99 | ¥7 | 超出每月2次免费后 |
| AI 语音次数 | $0.2 | ¥1.5 | 超出每日3次免费后 |
| 语伴槽位 | $0.49 | ¥3.5 | 永久，超出1个免费槽位后 |
| 语言包（每语言） | $1.9 | ¥14 | 永久解锁高级内容（VIP 享8折）|

### 9.2 收入来源

1. **直接订阅**：VIP 月费
2. **单次购买**：考试次数、AI 语音次数、语伴槽位、语言包
3. **商家广告**：按曝光计费（CPM），平台抽成 20-30%
4. **学习圈商城**：群内售卖学习资料，平台抽成
5. **保证金没收**：违规群的保证金归平台

### 9.3 Stripe 接入

支付 Webhook 已实现（`supabase/functions/stripe-webhook/`），需要：

1. 在 Stripe Dashboard 创建 Products 和 Prices
2. 获取 Stripe Secret Key 和 Webhook Signing Secret
3. 在 Supabase Edge Function 环境变量中设置：
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
4. 将 Webhook URL 设置为：
   `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`

---

## 10. 当前已知问题与后续建议

### 10.1 已知问题

| 问题 | 严重程度 | 说明 |
|------|---------|------|
| AI 回复为模拟数据 | 高 | AIAssistant 使用本地模板模拟 AI 回复，需接入 GPT/Claude API 才能实现真实智能回复 |
| 语音识别兼容性 | 中 | Web Speech API 在 iOS Safari 上可用，在部分 Android 浏览器可能受限；Firefox 不支持 |
| 支付流程未上线 | 高 | Stripe 集成代码已写好，但需要真实的 Stripe API Key 才能完成收款 |
| 电台内容为静态数据 | 中 | 当前无真实音频文件，TTS 依赖系统语音（质量参差不齐）。建议接入 Azure TTS 或 ElevenLabs |
| 游戏多人对战为模拟 | 低 | GameArena 多人模式（Matchmaking）数据库表已建，但实时对战逻辑需要 Supabase Realtime 深度集成 |
| 拍照解题依赖 OCR | 中 | CameraAI 需接入 Google Vision API 或 Azure Computer Vision 才能真实识别图片文字 |
| 汇率 Edge Function | 低 | exchange-rates 函数需要有效的汇率 API Key（Free tier 可用 exchangerate-api.com） |
| CSS 构建警告 | 低 | 一处注释含 `(admin-group-*)` 导致 CSS 压缩器警告，不影响功能 |
| Bundle 体积过大 | 低 | 当前打包后 JS ~600KB，建议按路由做代码分割（dynamic import）|

### 10.2 立即需要完成的事项

1. **接入真实 AI API**（最高优先级）
   ```typescript
   // 在 AIAssistant.tsx 中替换 simulateAIReply() 函数
   // 推荐：Anthropic Claude API（已有 claude-api skill 可用）
   // 配置：VITE_CLAUDE_API_KEY 环境变量
   ```

2. **激活 Stripe 支付**
   - 注册 Stripe 账号，获取 Live 密钥
   - 在 Supabase Edge Functions 中设置环境变量
   - 测试支付流程

3. **接入真实 TTS 服务**（电台质量提升）
   - 推荐：Azure Cognitive Services Speech（免费额度：5小时/月）
   - 或：ElevenLabs（多语言音质最佳）

4. **实现拍照 OCR**
   - 推荐：Google Cloud Vision API（免费额度：1000次/月）

5. **导入 TUFS 词汇**（丰富内容）
   - 按第 5 章步骤操作，大约 20 分钟完成

### 10.3 中期建议（1-3 个月）

- **Supabase Realtime 对战**：利用 `supabase.channel()` 实现真正的多人实时对战
- **推送通知**：接入 Firebase Cloud Messaging 实现学习提醒
- **音频资源托管**：将电台内容的 TTS 音频预生成并存入 Supabase Storage
- **App Store 上架**：按第 7 章 Capacitor 方案打包
- **内容管理后台**：为运营人员开发独立的内容管理界面（词汇/题目/电台）
- **A/B 测试框架**：对付费墙文案、价格点进行测试
- **代码分割**：将大型组件（ExamEngine、GameArena、AIAssistant）改为动态导入

### 10.4 长期建议（3-12 个月）

- **用户生成内容（UGC）**：开放词汇/记忆法/段子的社区创作和审核
- **企业版 B2B**：面向语言学校、企业培训的白标版本
- **AI 口语教练**：基于发音评分的个性化矫正训练
- **AR 翻译**：用摄像头实时翻译菜单/路牌（接入 ARKit/ARCore）
- **内容订阅**：专业电台节目、名师课程的付费内容
- **社区激励经济**：允许用户出售自己创作的记忆法/段子

---

## 11. 环境变量配置

### 11.1 必需变量（`.env` 文件）

```env
# Supabase（必填）
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...（anon public key）
```

### 11.2 可选变量（功能扩展时添加）

```env
# AI 功能（接入真实 AI 时添加）
VITE_CLAUDE_API_KEY=sk-ant-...
VITE_OPENAI_API_KEY=sk-...

# 语音合成（TTS）
VITE_AZURE_TTS_KEY=...
VITE_AZURE_TTS_REGION=eastasia

# 图像识别（拍照解题）
VITE_GOOGLE_VISION_API_KEY=...

# 支付（在 Supabase Edge Functions 环境变量中设置，非前端）
# STRIPE_SECRET_KEY=sk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...
```

### 11.3 Supabase 项目信息

当前配置的 Supabase 项目：
- **Project URL**：`https://tvocayicpiuzmbgnwwsf.supabase.co`
- **Region**：（见 Supabase 控制台）
- **Database**：PostgreSQL 15，18 个迁移文件已应用

> **安全提醒：** `VITE_SUPABASE_ANON_KEY` 是公开的只读密钥，通过 Row Level Security 保护数据安全。`service_role` Key 绝对不要暴露在前端代码或 `.env` 文件中。

---

## 附录：快速启动

```bash
# 克隆项目
git clone <repo_url>
cd gendou

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 填入你的 Supabase URL 和 Anon Key

# 本地开发
npm run dev

# 生产构建
npm run build

# 类型检查
npm run typecheck
```

---

*本说明书由创始人保密使用，包含商业敏感信息，请勿外传。*

*言道 (Gendou) · 让语言学习像呼吸一样自然*
