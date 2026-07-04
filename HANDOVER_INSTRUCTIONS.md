# 给接手AI的完整工作指令（直接复制粘贴到对话框）

---

## 项目接手指令

你正在接手一个名为"言道命理"的易学中医排盘APP项目。前任开发者已完成全部核心功能开发并推送到GitHub仓库。请先阅读仓库根目录的 `HANDOVER.md` 交接报告，了解完整项目信息。

### 第一步：拉取代码并启动

```bash
git clone https://github.com/wzmpa18/yandaoAPP.git
cd yandaoAPP
git checkout feat/zhongyimingli-main
git pull origin feat/zhongyimingli-main
```

最新提交：`1dad619`（已包含全部最新优化）

启动本地服务器：
```bash
python -m http.server 8080
```

预览：`http://localhost:8080/`

### 第二步：了解项目结构

项目是纯HTML+CSS+JS（无框架），390px移动端宽度。

**文件分布：**
- 根目录：9个页面HTML + 17个知识库md文件
- `utils/`：4个工具组件（AI接口、三输入、反馈系统）
- `paiban/`：8套排盘（HTML+引擎js+渲染js 各3个）+ 3个中医工具页

**AI接口配置在** `utils/ai-config.js`，包含3个提供商的真实API密钥：
- 豆包AI（火山云）：apiKey=`ark-8ddabd90-b58b-44c3-bec7-804020f11f7e-9ba89`，model=`doubao-pro`
- 言道AI（DeepSeek）：apiKey=`sk-6863ae4a63214cc1984b4cddba34eb5f`，model=`deepseek-chat`
- 混元AI（腾讯）：apiKey=`sk-gWpvWwrcm8UwoK8Bn0R5sQkUaWE1d2QkervqNtsP0J3iKyWr`，model=`hunyuan-turbo`
- 默认使用混元AI，通过localStorage可切换

### 第三步：必须检查验证的8个问题

**已修复但需验证的4个Bug：**

1. **六爻六亲显示** — 在`http://localhost:8080/paiban/liuyao-demo.html`排一个盘，确认六行正确显示子孙/妻财/父母/官鬼/兄弟（而非全显示"兄弟"）。修复在`paiban/liuyao-engine.js`的`getLiuQin()`函数，添加了`WX[]`类型转换数组。

2. **玄空飞星选择器** — 在`http://localhost:8080/paiban/xuankong-demo.html`选择运/山/向/水口后排盘，确认参数正确传入。修复在`paiban/xuankong-render.js`，将不存在的`selJu/selMountain/selWaterPort`改为`yunVal/shanVal/shuiVal`。

3. **年份范围** — 在任一排盘页面选择1900年和2099年排盘，确认干支计算正确。修复在`utils/tri-input.js`+6个render.js，范围从1940-2030扩展为1900-2100。

4. **大六壬天地盘映射** — 在`http://localhost:8080/paiban/daliuren-demo.html`排盘，确认天地盘每格天将/天盘地支/地盘地支对应正确。修复在`paiban/daliuren-render.js`，添加了`TPC_DZ_ORDER`映射数组。

**需要进一步优化的4个项：**

5. **AI接口实际调用测试** — 在任一排盘页面排盘后，点击浮动AI按钮（🤖），选择一个提供商，输入问题，确认流式输出正常。注意：API密钥可能已过期，需实际调用确认。

6. **紫微斗数三方四正+四化飞星** — 在`http://localhost:8080/paiban/ziwei-demo.html`排盘后，点击任意宫位，确认灰色虚线三角形+对宫直线正确显示；确认四化飞星箭头（禄绿/权紫/科蓝/忌红）从中心射向目标宫位。

7. **折叠卡片内容完整性** — 在六爻/梅花/玄空排盘结果页，逐个展开折叠卡片，确认内容完整不截断。如内容超出CSS的`max-height`限制（2000px/3000px），需增大限制值。

8. **排盘布局视觉精调** — 用户可能对比参考网站后提出具体修改。参考网站：文墨天机(紫微)、衍象(大六壬)、元亨利贞(综合)。

### 第四步：硬约束（不可违反）

- 仅HTML+CSS+JS，禁止框架
- 页面宽度390px（手机标准）
- 底部导航固定4列60px：主页|AI|学习|个人中心
- 主题色青绿色#00BCB4（八字页面除外，用黑金风格）
- 五行颜色：木#34A853/火#EA4335/土#A67C52/金#F1B232/水#2368B2
- 简体中文，无繁体
- 不修改算法引擎js（engine.js文件不动）
- 知识库：v2新版(前端展示) vs 旧版(底层算法)，旧版禁止前端引用
- 卡片圆角12px，背景#F8F8F8

### 第五步：用户偏好

用户期望：
- 严格1:1复制参考材料
- 高质量细节，彻底排查验证
- 直接反馈，不绕弯子
- 主动完成任务，不要问不必要的问题
- 所有繁体字必须转简体

### 第六步：E盘核心参考文件

排盘算法的最终依据在本地E盘（非仓库内）：
`E:\八字命理类文档包括排盘方式电子版\整理出来的命理类核心文件`
对标图片在：
`E:\八字命理类文档包括排盘方式电子版\对标图片`

如需核对算法，请告知用户提供E盘文件。

### 第七步：Git提交规范

```bash
git add -A
git commit -m "feat: 简明描述修改内容"
git push origin feat/zhongyimingli-main
```

提交备注用 `feat:`（新功能）或 `fix:`（修复bug）开头。

### 第八步：完整交接报告

仓库根目录有完整的 `HANDOVER.md` 交接报告，包含：
- 完整文件结构（每个文件的作用和大小）
- AI接口3个提供商的完整配置和密钥
- 4个已修复Bug的详细说明
- 8个待优化项的具体建议
- 12条硬约束清单
- 8个行业标杆参考网站URL
- 本地服务器启动方法和14个页面URL

请先阅读 `HANDOVER.md`，再开始工作。
