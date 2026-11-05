# 派对AI狂欢盒 (PartyHub AI) 🎮🤖

> **线上开黑 + 线下大屏双模式** 多人互动聚会游戏合集，搭载毒舌搞笑 AI 主持人兼裁判（Bot-888）。
> 手机扫码或填4位房间号即开即玩，支持实时弹幕互怼、快捷语音包、重连断线保护。

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![React 19](https://img.shields.io/badge/React%2019-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Express + WebSocket](https://img.shields.io/badge/Express%20%2B%20WebSocket-000000?style=flat-square&logo=express&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini%203.8%20Flash-4285F4?style=flat-square&logo=google&logoColor=white)

---

## 🎯 核心功能一览

### 1. 经典聚会游戏深度交互版
- 🕵️‍♂️ **《谁是卧底 · 心机战》**：长按隐私防窥看词、回合发言、15秒【质询对决台】双方辩论、实时心虚/怀疑指针对抗、AI毒舌法官裁决与全员投票出局。
- 🎨 **《灵魂画手 · 毒舌画廊》**：多色实时画板、全员实时竞猜（答对+80分）、AI毒舌艺术拍卖行（AI估值+毒舌点评、全员加价竞拍画作）。
- ⚡ **《手速抢答 · 命运大转盘》**：实时极速抢答器、3张战术道具卡（💣 炸弹偷分、👑 霸权强答、🔥 连击双倍）、四选一极速竞答、答错即转 3D Canvas 命运大惩罚转盘（线上社死/线下真实挑战）。
- 🐢 **《AI海龟汤 · 案发现场》**：AI生成高能迷案、3位可提问嫌疑人（藏匿不在场证明）、全员提问获【是/否/无关/关键线索】判定、一键破案挑战（破案成功+120分）。

### 2. 聚会氛围与AI主持人
- 🤖 **AI主持人（Bot-888）**：高频动态表情、毒舌点评、游戏串场、规则引导与实时判决。
- 🍅 **全屏实时互动投掷**：全员可随时发送番茄、鸡蛋、爆米花、掌声、爱心和炸弹，伴随 Web Audio 音效与飘浮动画。
- 📢 **快捷嘴炮语音抽屉**：“你不对劲！”、“他在硬编！”、“急急急！”点击即全员广播。
- 👑 **终局 AI 毒舌颁奖盛典**：派对结束一键结算，评选【全场显眼包之王 MVP】、【奥斯卡影帝】、【灵魂抽象画神】、【自爆卡车奖】，支持一键复制战报分享。

### 3. 网络与双端优化
- 🌐 **双模式切换**：
  - **线下大屏模式**：大屏幕显示主战局与实时对决，玩家手机扫码作为手柄操作。
  - **线上开黑模式**：全员手机/电脑独立操作，各自看到专属私密信息与公共画面。
- 🔄 **断线自动重连与抗弱网**：
  - 18秒 Keep-alive 心跳保活。
  - 30秒断线缓冲保护，切屏或微信浏览器暂时息屏后重新点开自动恢复房间身份、手牌与得分。
- 🚀 **国内网络加载极速**：已剔除外部 Google Fonts 依赖，全部采用中国系统原生字体栈，零加载阻塞。

---

## 🛠️ 本地快速运行

### 1. 环境准备
- Node.js >= 20.0.0 (推荐 Node 22)
- npm 或 bun

### 2. 安装与启动
```bash
# 1. 克隆仓库
git clone <你的GitHub仓库地址>
cd <仓库目录>

# 2. 安装依赖
npm install

# 3. 配置环境变量 (可选，若不配置将自动使用内置题库和离线模式)
cp .env.example .env
# 编辑 .env 填入你的 GEMINI_API_KEY
# GEMINI_API_KEY=your_gemini_api_key

# 4. 启动开发服务器 (前后端集成 WebSocket)
npm run dev

# 浏览器访问 http://localhost:3000 即可开玩！
```

---

## 🚢 部署与上线指南

由于本项目是一个包含 **WebSocket 长连接** 和 **Express API** 的全栈 Node 应用，推荐部署到支持 WebSocket 的服务器或托管平台。

### 方案 A：国内免翻墙部署（解决微信/国内网络访问问题）

#### 选项 1：Zeabur（极力推荐，国内直连极佳，支持一键部署）
1. 注册登录 [Zeabur](https://zeabur.com)。
2. 点击 **Create Project** -> **Deploy from GitHub Repo**。
3. 选择你的项目仓库，Zeabur 会自动识别 Node.js / Dockerfile 进行构建。
4. 在服务环境变量（Environment Variables）中添加：
   - `GEMINI_API_KEY`: 你的 Google Gemini API Key
   - `PORT`: `3000`
5. 绑定 Zeabur 提供的免费二级域名（或自定义域名，国内直连无压力）。

#### 选项 2：国内云服务器（阿里云 / 腾讯云轻量应用服务器）
使用自带的 `Dockerfile` 一键容器化运行：
```bash
# 1. 在服务器上拉取代码
git clone <你的GitHub仓库地址>
cd <仓库目录>

# 2. 构建 Docker 镜像
docker build -t partyhub-ai .

# 3. 运行容器
docker run -d -p 80:3000 \
  -e GEMINI_API_KEY="你的API密钥" \
  --name partyhub \
  --restart always \
  partyhub-ai

# 玩家直接通过服务器 IP 或域名即可进入房间！
```

### 方案 B：海外免费托管平台（适合个人测试）

#### 选项 1：Render.com
1. 登录 [Render](https://render.com/)，选择 **New Web Service**。
2. 连接 GitHub 仓库。
3. 设置：
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. 添加环境变量 `GEMINI_API_KEY`。

#### 选项 2：Railway.app
1. 登录 [Railway](https://railway.app/)，选择 **Deploy from GitHub Repo**。
2. Railway 会自动根据 `package.json` 中的 `build` 和 `start` 自动上线。

---

## 📂 项目架构

```
.
├── server.ts                   # Express + WebSocket 服务器 (游戏房间调度、AI接口代理、心跳保活)
├── src/
│   ├── types/game.ts           # 完整游戏状态机类型定义
│   ├── server/
│   │   ├── roomManager.ts      # 纯逻辑房间管理状态机 (对决、拍卖、抢答、海龟汤、颁奖)
│   │   └── roomManager.test.ts # 完整单元测试集 (100% 通过)
│   ├── components/
│   │   ├── TitleScreen.tsx     # 首页 (创建房间 / 填号加入 / URL参数自动解析)
│   │   ├── HostLobby.tsx       # 游戏大厅 (模式切换、召唤AI陪玩、二维码展示、开始游戏)
│   │   ├── AIHostBot.tsx       # SVG动态表情毒舌AI机器人 (Bot-888)
│   │   ├── FloatingReactions.tsx# 实时投掷互动粒子 (番茄/鸡蛋/掌声/爱心/炸弹)
│   │   ├── QuickVoiceBar.tsx   # 快捷语音互怼抽屉
│   │   ├── AwardCeremonyModal.tsx # 终局AI颁奖典礼与显眼包MVP评选
│   │   └── games/
│   │       ├── UndercoverHost.tsx # 谁是卧底心机战
│   │       ├── DoodleHost.tsx     # 灵魂画手毒舌画廊
│   │       ├── BuzzerHost.tsx     # 手速抢答命运转盘
│   │       └── TurtleSoupHost.tsx # AI海龟汤案发现场
│   ├── utils/sound.ts          # Web Audio API 纯合成器音效 (免外部音频加载)
│   ├── App.tsx                 # 前端根组件 (WebSocket连接、自动重连握手、游戏分发)
│   └── main.tsx                # React 19 渲染入口
├── Dockerfile                  # 容器化部署文件
└── .github/workflows/ci.yml    # GitHub Actions 自动化测试与构建
```

---

## 🧪 自动化测试

运行纯状态机逻辑测试：
```bash
npx tsx --test src/server/roomManager.test.ts
```

运行 TypeScript 类型检查：
```bash
npm run lint
```

生产打包测试：
```bash
npm run build
```

---

## 📄 开源许可证
MIT License
