Campus Market Seed

《校园轻集市》AI 辅助前端工程实践课程种子仓库

⸻

项目简介

Campus Market Seed 是《校园轻集市》课程的统一种子仓库（Seed Repository）。

本仓库不仅提供 Vue 3 前端项目模板，还包含课程文档、开发规范、AI 协作规范、过程性证据模板以及自动检测框架，为整个实训提供统一的开发基础。

本仓库是所有同学开展项目实践的起点。

⸻

项目目标

通过本课程，你将完成一个基于 Vue 3 的校园轻集市前端项目，并体验真实的软件工程开发流程。

课程重点包括：

* Vue 3 工程化开发
* Git 版本管理
* AI Coding 协作开发
* 软件工程规范
* 过程性证据管理
* 项目验收与自动检测

⸻

快速开始

首次使用本仓库，请按照以下顺序阅读文档：

README.md
    │
    ▼
docs/guide/Environment_Setup.md
    │
    ▼
docs/guide/Getting_Started.md

⸻

运行项目

### 1. 安装依赖

```bash
git clone <课程仓库地址>
cd campus-market-seed
pnpm install
```

### 2. 启动 Mock 服务（必须先启动）

```bash
npx json-server --watch db.json --port 3001
```

Mock 服务启动后，访问 http://localhost:3001 可查看所有 API 接口。

### 3. 启动前端开发服务器

在新终端中执行：

```bash
pnpm dev
```

浏览器访问：

http://localhost:5173

### 4. 构建生产版本

```bash
pnpm build
```

构建产物输出到 `dist` 目录。

### 5. 代码检查

```bash
# ESLint 检查
pnpm lint

# TypeScript 类型检查
pnpm type-check
```

⸻

项目结构

campus-market-seed
├── docs
│   ├── ai              # AI 协作规范
│   ├── evidence        # 每日过程证据（Day1-Day7）
│   └── guide           # 学生使用指南
├── scripts             # 自动检测工具
├── src
│   ├── api             # API 接口封装
│   ├── components      # 公共组件
│   ├── stores          # Pinia 状态管理
│   │   ├── user.ts     # 用户状态 Store
│   │   └── favorite.ts # 收藏状态 Store
│   ├── views           # 页面组件（12个）
│   ├── router          # 路由配置
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── db.json             # Mock 数据库（含 users/favorites/trades/lostFounds/groupBuys/errands/conversations/messages）
└── CHECK_REPORT.md     # 自动检测报告（后续版本启用）

⸻

文档导航

| 文档 | 说明 |
|------|------|
| docs/guide/Environment_Setup.md | 配置课程开发环境 |
| docs/guide/Getting_Started.md | Day1 快速开始指南 |
| docs/ai/AI_Collaboration_Card.md | AI 协作记录规范 |
| docs/evidence/ | 每日过程性证据（Day1-Day7） |

⸻

技术栈

* Vue 3
* TypeScript
* Vite
* Vue Router
* Pinia
* Element Plus
* Axios
* ESLint
* Oxlint

⸻

功能模块

| 模块 | 页面 | 说明 |
|------|------|------|
| 首页 | HomeView | 校园轻集市首页，展示分类入口 |
| 二手交易 | TradeView | 二手商品列表与收藏功能 |
| 失物招领 | LostFoundView | 寻物启事与失物招领列表 |
| 拼单搭子 | GroupBuyView | 拼单、学习搭子、运动搭子 |
| 跑腿委托 | ErrandView | 代取快递、代买物品、代办事务 |
| 发布信息 | PublishView | 动态表单发布四类业务数据 |
| 商品详情 | DetailView | 商品/信息详情页 |
| 列表页 | ListView | 通用列表展示 |
| 消息中心 | MessageView | 聊天会话与消息 |
| 用户中心 | UserCenterView | 用户资料、我的发布、我的收藏 |
| 个人主页 | ProfileView | 用户详细资料展示 |
| 公告栏 | BoardView | 校园公告展示 |

⸻

开发规范

在整个实训过程中，请遵循以下要求：

* 使用 Git 管理项目开发过程；
* 每完成一个独立功能及时提交 Commit；
* 合理使用 AI Coding 工具辅助开发；
* 保留 AI 协作记录；
* 每天完成对应的 Evidence；
* 保持项目始终能够正常运行。

⸻

后续版本

后续版本将逐步提供：

* 自动检测工具（Check Engine）
* 自动评分报告
* Git 提交分析
* AI 协作分析
* 教师验收工具

⸻

License

本仓库仅用于《校园轻集市》课程教学与实践。