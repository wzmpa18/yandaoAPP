# 言道命理APP — 项目交接报告

> 生成时间：2026-07-04
> 最后提交：`1dad619` on `feat/zhongyimingli-main`
> 仓库地址：https://github.com/wzmpa18/yandaoAPP.git

---

## 一、项目概览

### 1.1 项目名称
言道命理（yandaoAPP）— 易学中医综合排盘工具

### 1.2 技术栈
- 纯前端：HTML + CSS + JavaScript（无框架，无构建工具）
- IIFE封装，仅暴露必要全局变量
- 移动端优先：390px统一宽度
- Python HTTP Server作为本地开发服务器

### 1.3 仓库信息
- 远程仓库：`https://github.com/wzmpa18/yandaoAPP.git`
- 开发分支：`feat/zhongyimingli-main`
- 备用分支：`feat/mingli-pages-v2`
- 最新提交：`1dad619 feat: 对标行业标杆网站优化全排盘页面布局与功能`

### 1.4 本地路径
- 项目根目录：`C:\Users\ZhuanZ\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3be5a81b783dda6466b679\zhongyimingli\`
- E盘核心算法参考：`E:\八字命理类文档包括排盘方式电子版\整理出来的命理类核心文件`
- 对标图片参考：`E:\八字命理类文档包括排盘方式电子版\对标图片`

---

## 二、完整文件结构

### 2.1 根目录页面文件（9个）
| 文件 | 说明 | 大小 |
|------|------|------|
| `index.html` | 首页（黄历核心+地母经+八字对标） | 9KB |
| `yixue.html` | 易学排盘入口（8个排盘入口卡片） | 6KB |
| `zhongyi-zone.html` | 中医工具入口（3个中医工具卡片） | 4KB |
| `ai.html` | AI对话页（3提供商切换+流式输出） | 17KB |
| `study.html` | 学习中心（17本古籍+3套模拟考试） | 90KB |
| `profile.html` | 个人中心（社交+设置） | 13KB |
| `huangli.html` | 黄历详情页 | 6KB |
| `wuyunliuqi.html` | 五运六气详情页 | 6KB |
| `server.py` | Python HTTP服务器脚本 | 1KB |

### 2.2 utils/ 工具组件（4个）
| 文件 | 说明 | 大小 |
|------|------|------|
| `ai-config.js` | AI接口配置+命理解析弹窗（3提供商+流式SSE） | 36KB |
| `tri-input.js` | 三输入模式组件（公历/农历/四柱） | 19KB |
| `feedback.js` | 全局异常捕获+用户反馈系统 | 26KB |
| `feedback.css` | 反馈系统样式 | 8KB |

### 2.3 paiban/ 排盘页面（26个 = 8套 × HTML+引擎+渲染 + 3个中医页）

#### 排盘页面HTML（8个）
| 文件 | 术数类型 | 大小 |
|------|----------|------|
| `bazi-demo.html` | 八字排盘（黑金风格，4Tab页） | 64KB |
| `ziwei-demo.html` | 紫微斗数（4×4网格十二宫） | 60KB |
| `daliuren-demo.html` | 大六壬（三传+四课+天地盘） | 56KB |
| `qimen-demo.html` | 奇门遁甲（九宫格+宫位详情） | 45KB |
| `liuyao-demo.html` | 六爻纳甲（六行卦象+折叠详解） | 54KB |
| `meihua-demo.html` | 梅花易数（五卦网格+折叠详解） | 51KB |
| `xuankong-demo.html` | 玄空飞星（九宫飞星盘+排龙诀） | 54KB |
| `xiaoliuren-demo.html` | 小六壬（2×3宫格+折叠详解） | 61KB |

#### 排盘引擎JS（8个，纯算法逻辑，不涉及UI）
| 文件 | 说明 |
|------|------|
| `bazi-engine.js` | 八字排盘引擎（四柱+大运+十神+神煞） |
| `ziwei-engine.js` | 紫微斗数引擎（12宫星曜+四化+大限流年） |
| `daliuren-engine.js` | 大六壬引擎（四课三传+天地盘+天将） |
| `qimen-engine.js` | 奇门遁甲引擎（九宫八门+九星八神+天地盘干） |
| `liuyao-engine.js` | 六爻纳甲引擎（纳甲装卦+世应六亲） |
| `meihua-engine.js` | 梅花易数引擎（先天起卦+体用生克） |
| `xuankong-engine.js` | 玄空飞星引擎（运盘+山向星+排龙诀） |
| `xlr-engine.js` | 小六壬引擎（六宫落位+断语） |

#### 排盘渲染JS（8个，UI渲染逻辑，对接引擎输出到HTML）
| 文件 | 说明 |
|------|------|
| `bazi-render.js` | 八字渲染（四柱表格+神煞卡片+五行状态条） |
| `ziwei-render.js` | 紫微渲染（12宫格+三方四正虚线+四化飞星箭头） |
| `daliuren-render.js` | 大六壬渲染（三传表格+四课表格+天地盘网格） |
| `qimen-render.js` | 奇门渲染（九宫格+宫位详情弹窗） |
| `liuyao-render.js` | 六爻渲染（六行卦象+六亲六神+动变爻） |
| `meihua-render.js` | 梅花渲染（五卦网格+断语折叠卡片） |
| `xuankong-render.js` | 玄空渲染（九宫飞星盘+排龙诀轮盘） |
| `xlr-render.js` | 小六壬渲染（2×3宫格+六宫详解折叠） |

#### 中医工具页面（3个）
| 文件 | 说明 |
|------|------|
| `jingluo-demo.html` | 经络查询（12正经361穴+奇经八脉+搜索） |
| `tcm-demo.html` | 中医问诊（四诊合参+28脉+18证型辨证） |
| `zhongyi-study-demo.html` | 中医学习（25方剂+60中药+20穴位+6Tab） |

#### 其他历史文件
| 文件 | 说明 |
|------|------|
| `liuren-demo.html` | 六壬另一版本（历史保留，未在导航中引用） |

### 2.4 知识库文件（17个 = 8套v2新版 + 8套旧版 + 3个中医）

#### v2新版知识库（前端展示用，8个）
| 文件 | 大小 | 说明 |
|------|------|------|
| `bazi_standard_kb_v2.md` | 99KB | 八字断语 |
| `ziwei_standard_kb_v2.md` | 68KB | 紫微斗数断语 |
| `daliuren_standard_kb_v2.md` | 91KB | 大六壬断语 |
| `qimen_standard_kb_v2.md` | 62KB | 奇门遁甲断语 |
| `meihualiuyao_standard_kb_v2.md` | 79KB | 梅花易数+六爻断语（合并） |
| `xuankong_standard_kb_v2.md` | 39KB | 玄空飞星断语 |
| `xiaoliuren_standard_kb_v2.md` | 41KB | 小六壬断语 |
| `tcm_standard_kb_v2.md` | 8KB | 中医断语 |

#### 旧版知识库（底层算法备用，禁止前端引用，8个）
| 文件 | 说明 |
|------|------|
| `bazi_standard_kb.md` | 八字底层算法参考 |
| `ziwei_standard_kb.md` | 紫微底层算法参考 |
| `daliuren_standard_kb.md` | 大六壬底层算法参考 |
| `qimen_standard_kb.md` | 奇门底层算法参考（129KB，最大） |
| `meihualiuyao_standard_kb.md` | 梅花六爻底层算法参考 |
| `xuankong_standard_kb.md` | 玄空底层算法参考 |
| `xiaoliuren_standard_kb.md` | 小六壬底层算法参考 |
| `jingluo_standard_kb_v2.md` | 经络知识库（仅v2版） |
| `zhongyi_standard_kb_v2.md` | 中医学习知识库（仅v2版） |

---

## 三、AI接口配置（关键密钥）

### 3.1 配置文件位置
`utils/ai-config.js`（36KB，814行）

### 3.2 三个AI提供商完整配置

#### 提供商1：豆包AI（火山云/字节跳动）
```
id: doubao
name: 豆包AI
apiUrl: https://ark.cn-beijing.volces.com/api/v3/chat/completions
apiKey: ark-8ddabd90-b58b-44c3-bec7-804020f11f7e-9ba89
model: doubao-pro
协议: OpenAI兼容
```

#### 提供商2：言道AI（DeepSeek）
```
id: deepseek
name: 言道AI
apiUrl: https://api.deepseek.com/v1/chat/completions
apiKey: sk-6863ae4a63214cc1984b4cddba34eb5f
model: deepseek-chat
协议: OpenAI兼容
```

#### 提供商3：混元AI（腾讯）
```
id: hunyuan
name: 混元AI
apiUrl: https://api.hunyuan.cloud.tencent.com/v1/chat/completions
apiKey: sk-gWpvWwrcm8UwoK8Bn0R5sQkUaWE1d2QkervqNtsP0J3iKyWr
model: hunyuan-turbo
协议: OpenAI兼容
```

### 3.3 当前默认提供商
`state.currentProvider = 'hunyuan'`（可通过localStorage `aicc_provider` 切换）

### 3.4 AI功能说明
- `chat(messages, onResult, onError, opts)` — 核心请求函数，支持流式SSE
- `openAIDialog(pageType, paipanData)` — 弹窗UI组件
- `collectPaipanData(pageType)` — 自动收集页面排盘数据作为AI上下文
- 8种排盘类型各有独立system提示词
- 所有排盘页面自动注入浮动AI按钮（🤖）

### 3.5 GitHub仓库认证
- 仓库：`https://github.com/wzmpa18/yandaoAPP.git`
- 用户名：`wzmpa18`
- 认证方式：Windows Credential Manager已存储Git凭证
- 如需重新认证：`git credential-manager-core configure`

---

## 四、已完成功能清单

### 4.1 排盘引擎（8套全部完成）
- [x] 八字排盘 — 四柱+大运+十神+神煞+五行调候
- [x] 紫微斗数 — 12宫星曜+四化飞星+三方四正+大限流年
- [x] 大六壬 — 四课三传+天地盘+十二天将+课体格局
- [x] 奇门遁甲 — 九宫八门+九星八神+天地盘干+用神生克
- [x] 六爻纳甲 — 纳甲装卦+世应六亲+日月建+动变爻
- [x] 梅花易数 — 先天起卦+体用生克+互变卦+卦象断辞
- [x] 玄空飞星 — 九宫飞星+山向运星+排龙诀+下卦替卦
- [x] 小六壬 — 六宫落位+断语+道家佛家起课

### 4.2 页面布局优化（本轮完成）
- [x] 大六壬 — 重做紧凑布局，三传+四课+天地盘一屏可见，神煞折叠
- [x] 紫微斗数 — 星曜颜色修正，宫格紧凑化，飞星箭头文字标签
- [x] 六爻/梅花 — 结果页知识库折叠化（5-6个折叠卡片）
- [x] 玄空飞星 — 8个解读卡片折叠化，补全AI解析按钮
- [x] 八字 — 补全底部功能栏+导航+回到顶部
- [x] 小六壬 — 补全底部导航+回到顶部
- [x] 全局 — viewport统一390px，底部导航统一"主页|AI|学习|个人中心"

### 4.3 基础功能
- [x] 年份范围1900-2100（所有排盘页面）
- [x] 三输入模式（公历/农历/四柱）— 八字/紫微/大六壬/奇门
- [x] AI接口3提供商完整接入（所有排盘页面）
- [x] 全局异常捕获+用户反馈系统
- [x] 底部导航全页面统一
- [x] 17本古籍+3套模拟考试填充
- [x] 3个中医工具页面完整数据

---

## 五、已知问题与待优化项（必须检查）

### 5.1 历史Bug（已修复但需验证）

#### Bug 1：六爻六亲全显示"兄弟"
- **文件**：`paiban/liuyao-engine.js`
- **原因**：`DZ_WX`数组使用数字(0-4)，`GONG_WUXING`使用字符串('金'等)，类型不匹配导致比较失败
- **修复**：添加`WX[]`转换数组，在`getLiuQin()`函数中统一类型
- **验证方法**：排一个六爻盘，检查六行是否正确显示子孙/妻财/父母/官鬼/兄弟

#### Bug 2：玄空飞星选择器ID不匹配
- **文件**：`paiban/xuankong-render.js`
- **原因**：代码引用`selJu/selMountain/selGuaType/selYongType/selWaterPort`等不存在的ID
- **修复**：改为实际HTML中的`yunVal/shanVal/radio按钮/shuiVal`，并添加中文数字转阿拉伯数字
- **验证方法**：在玄空页面选择运/山/向/水口后点击排盘，确认参数正确传入

#### Bug 3：年份范围限制（本轮修复）
- **文件**：`utils/tri-input.js` + 6个render.js文件
- **原因**：年份选择器硬编码为1940-2030，农历干支从1984起算
- **修复**：全部扩展为1900-2100，干支转公历支持多个甲子周期(1924/1984/2044)
- **验证方法**：选择1900年和2099年排盘，确认干支计算正确

#### Bug 4：大六壬天地盘宫位映射错误（本轮修复）
- **文件**：`paiban/daliuren-render.js`
- **原因**：HTML单元格按顺时针布局(卯辰巳午/寅未/丑申/子亥戌酉)，但代码按DZ顺序(子丑寅卯...)映射
- **修复**：添加`TPC_DZ_ORDER = [3,4,5,6,2,7,1,8,0,11,10,9]`映射数组
- **验证方法**：排大六壬盘，确认天地盘每格的天将/天盘地支/地盘地支对应正确

### 5.2 需要进一步优化的项

#### 优化项1：排盘布局视觉精调
- **问题**：本轮已对标行业标杆优化布局，但用户反馈可能仍有视觉差异
- **参考网站**：
  - 紫微斗数：文墨天机 `https://www.wenmotianji.com/`
  - 大六壬：衍象 `https://profound.fate-craft.com/tools/dlr`
  - 综合：元亨利贞 `https://paipan.china95.net/`
- **建议**：让用户截图当前页面与参考网站对比，针对性调整

#### 优化项2：AI接口实际调用测试
- **问题**：代码层面已完整接入，但未在浏览器中实际触发API调用验证
- **测试方法**：在任一排盘页面点击排盘后，点击浮动AI按钮，选择一个提供商，输入问题，确认流式输出正常
- **注意事项**：API密钥可能已过期或被限制，需实际调用确认

#### 优化项3：紫微斗数三方四正交互
- **问题**：三方四正虚线（三角形+对宫直线）的点击交互需验证
- **文件**：`paiban/ziwei-render.js` 中的 `createSanfangOverlay()` / `getGongCenter()` / `drawTriangle()` / `drawDiagonal()`
- **验证方法**：点击任意宫位，确认虚线正确显示三角形（本宫+两个三合宫）和直线（本宫→对宫）

#### 优化项4：紫微斗数四化飞星箭头
- **问题**：四化飞星SVG箭头需要精确定位
- **文件**：`paiban/ziwei-render.js` 中的飞星渲染部分
- **颜色规范**：禄(绿#34A853)/权(紫#9C27B0)/科(蓝#2368B2)/忌(红#EA4335)
- **验证方法**：确认箭头从盘中心射向目标宫位，文字标签可见

#### 优化项5：折叠卡片展开后内容完整性
- **问题**：六爻/梅花/玄空的折叠卡片内容较多，展开后需确认内容完整不截断
- **CSS限制**：`max-height:2000px`（六爻梅花）/ `max-height:3000px`（玄空），如内容超出会被截断
- **验证方法**：逐个展开折叠卡片，检查内容是否完整显示

#### 优化项6：八字页面黑金风格与其他页面青绿色主题的差异
- **问题**：八字页面保持黑金风格（用户最初要求），与其他7个排盘页面的青绿色#00BCB4主题不同
- **底部功能栏**：八字用金色高亮保存按钮，其他页面用红色
- **建议**：如需统一，可改为青绿色主题；如保持差异化，确认用户意图

#### 优化项7：首页黄历数据为静态
- **文件**：`index.html`
- **问题**：黄历的干支、地母经、宜忌、彭祖百忌目前为硬编码静态数据
- **建议**：后续可接入实时黄历API或用JS计算当日干支

#### 优化项8：子午流注数据为简化版
- **文件**：`index.html`
- **问题**：子午流注仅显示当前时辰对应经络，未考虑五运六气
- **建议**：可接入完整的子午流注计算逻辑

### 5.3 硬约束清单（不可违反）

| 编号 | 约束 | 说明 |
|------|------|------|
| H01 | 仅HTML+CSS+JS | 禁止引入框架/构建工具 |
| H02 | 首页不可修改 | `index.html`结构已定稿（除非用户明确要求） |
| H03 | 页面宽度390px | 所有页面`body{max-width:390px}` |
| H04 | 底部导航60px | 固定4列：主页|AI|学习|个人中心 |
| H05 | 主题色#00BCB4 | 青绿色（八字除外，用黑金） |
| H06 | 五行颜色 | 木#34A853/火#EA4335/土#A67C52/金#F1B232/水#2368B2 |
| H07 | 简体中文 | 所有文字无繁体 |
| H08 | 不写JS算法 | 只做UI/布局/交互，算法在engine.js中 |
| H09 | v2知识库前端 | 旧版kb(无v2)禁止前端引用 |
| H10 | 卡片圆角12px | 背景色#F8F8F8 |
| H11 | 主按钮#00BCB4 | 高度62px，圆角10px，白色粗体 |
| H12 | 所有section间距14px | `margin-bottom:14px` |

---

## 六、启动与预览

### 6.1 本地服务器
```bash
cd C:\Users\ZhuanZ\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3be5a81b783dda6466b679\zhongyimingli
python -m http.server 8080
```
预览地址：`http://localhost:8080/`

### 6.2 关键页面入口
| 页面 | URL |
|------|-----|
| 首页 | http://localhost:8080/ |
| 易学入口 | http://localhost:8080/yixue.html |
| 中医入口 | http://localhost:8080/zhongyi-zone.html |
| 八字排盘 | http://localhost:8080/paiban/bazi-demo.html |
| 紫微斗数 | http://localhost:8080/paiban/ziwei-demo.html |
| 大六壬 | http://localhost:8080/paiban/daliuren-demo.html |
| 奇门遁甲 | http://localhost:8080/paiban/qimen-demo.html |
| 六爻排盘 | http://localhost:8080/paiban/liuyao-demo.html |
| 梅花易数 | http://localhost:8080/paiban/meihua-demo.html |
| 玄空飞星 | http://localhost:8080/paiban/xuankong-demo.html |
| 小六壬 | http://localhost:8080/paiban/xiaoliuren-demo.html |
| AI对话 | http://localhost:8080/ai.html |
| 学习中心 | http://localhost:8080/study.html |
| 个人中心 | http://localhost:8080/profile.html |

### 6.3 Git操作
```bash
# 查看状态
cd zhongyimingli
git status

# 提交
git add -A
git commit -m "feat: 描述信息"

# 推送
git push origin feat/zhongyimingli-main

# 查看提交历史
git log --oneline -10
```

---

## 七、行业标杆参考网站

| 术数 | 参考网站 | 说明 |
|------|----------|------|
| 综合 | https://paipan.china95.net/ | 元亨利贞，行业通用标准 |
| 综合 | https://www.shen88.com/paipan/ | 神巴巴，交互逻辑参考 |
| 紫微 | https://www.wenmotianji.com/ | 文墨天机，紫微标杆 |
| 紫微 | https://www.81pan.com/ziwei/ | 灵匣紫微，信息层级参考 |
| 大六壬 | https://profound.fate-craft.com/tools/dlr | 衍象大六壬，现代布局标杆 |
| 奇门 | https://www.qimendunjia.com/paipan/ | 奇门遁甲在线 |
| 六爻/梅花 | https://www.liuyao.net/ | 六爻排盘网 |
| 历法 | https://github.com/6tail/lunar-javascript | lunar-javascript开源历法库 |

---

## 八、注意事项

1. **算法以E盘为准**：所有排盘核心算法、判定标准以`E:\八字命理类文档包括排盘方式电子版\整理出来的命理类核心文件`为最终依据
2. **断语以v2知识库为准**：前端展示使用`*_standard_kb_v2.md`，底层算法参考`*_standard_kb.md`（无v2后缀）
3. **不删除原有功能**：仅做补全、优化、规范化调整
4. **用户偏好**：期望严格1:1复制参考材料，高质量细节，直接反馈，简体中文无繁体
5. **提交规范**：提交备注使用 `feat:` / `fix:` 前缀，描述具体修改内容
