# 校园轻集市

一个基于 Vue 3 的校园生活服务平台，涵盖二手交易、失物招领、拼单搭子、跑腿委托四大核心业务场景。

---

## 项目简介

校园轻集市是一个面向大学生的校园生活服务平台，旨在解决校园内闲置物品流转、失物招领、拼单凑单、跑腿代办等实际需求。项目采用前后端分离架构，前端使用 Vue 3 + TypeScript + Vite 技术栈，后端通过 JSON Server 模拟 RESTful API。

本项目是《AI 辅助前端工程实践》课程的实训成果，历时 7 天完成，覆盖从业务梳理、页面骨架、数据建模、列表渲染、发布表单、状态管理到交互优化的完整前端开发流程。

---

## 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| 框架 | Vue 3 | Composition API + `<script setup>` |
| 语言 | TypeScript | 类型安全 |
| 构建工具 | Vite | 快速开发与构建 |
| 路由 | Vue Router | 多页面路由管理 |
| 状态管理 | Pinia | 用户状态、收藏状态 |
| UI 组件库 | Element Plus | 基础组件 |
| HTTP 客户端 | Axios | API 请求 |
| Mock 数据 | JSON Server | 模拟后端接口 |
| 代码检查 | ESLint + Oxlint | 代码质量保障 |
| 设计风格 | 极简主义 | 黑白灰配色、细边框、大量留白 |

---

## 快速开始

### 环境要求

- Node.js >= 22.18.0
- pnpm >= 8.x

### 安装依赖

```bash
pnpm install
```

### 启动 Mock 服务（必须先启动）

```bash
pnpm mock
```

Mock 服务启动后，访问 http://localhost:3001 可查看所有 API 接口。

### 启动前端开发服务器

在新终端中执行：

```bash
pnpm dev
```

浏览器访问：http://localhost:5173

### 构建生产版本

```bash
pnpm build
```

构建产物输出到 `dist` 目录。

### 代码检查

```bash
# TypeScript 类型检查
pnpm type-check

# ESLint 检查
pnpm lint
```

---

## 功能模块

### 核心业务页面

| 页面 | 路由 | 功能说明 |
|------|------|----------|
| 首页 | /home | 分类入口、最新发布、校园公告 |
| 二手交易 | /trade | 商品列表、分类筛选、关键词搜索、收藏 |
| 失物招领 | /lost-found | 失物列表、类型筛选、寻物/招领分类 |
| 拼单搭子 | /group-buy | 拼单列表、分类筛选、人数进度 |
| 跑腿委托 | /errand | 任务列表、悬赏金额、状态标签 |
| 发布信息 | /publish | 动态表单、四种类型切换、提交反馈 |
| 商品详情 | /detail/:id | 详情展示、收藏、联系卖家 |
| 全部列表 | /list | 综合列表、多条件筛选 |
| 消息中心 | /message | 会话列表、消息记录 |
| 用户中心 | /user | 个人资料、统计数据、我的收藏 |
| 个人主页 | /profile | 详细资料、功能菜单 |
| 公告栏 | /board | 校园公告展示 |

### 状态管理

- **user store**：当前用户信息、模拟登录状态
- **favorite store**：收藏列表、添加/移除/切换收藏

### 交互优化（Day6）

- **加载状态**：列表页请求数据时显示 LoadingState 组件
- **空状态**：无数据时显示 EmptyState 组件，给出友好提示
- **错误状态**：接口请求失败时显示 ErrorState 组件，支持重新加载
- **搜索功能**：二手交易页支持关键词搜索（标题、描述、校区、地点）
- **分类筛选**：各列表页支持按类型/分类筛选
- **收藏反馈**：收藏/取消收藏有 Toast 提示和按钮状态变化
- **表单反馈**：发布页面支持提交中禁用、失败提示、必填项标识、类型切换重置

---

## 项目目录结构

```
campus-market-seed/
├── docs/
│   ├── ai/
│   │   └── AI_Collaboration_Card.md    # AI 协作记录
│   ├── evidence/
│   │   ├── Day1_Evidence.md            # Day1 证据卡：项目启动与业务梳理
│   │   ├── Day2_Evidence.md            # Day2 证据卡：页面骨架与路由导航
│   │   ├── Day3_Evidence.md            # Day3 证据卡：Mock 数据与列表渲染
│   │   ├── Day4_Evidence.md            # Day4 证据卡：发布表单与数据新增
│   │   ├── Day5_Evidence.md            # Day5 证据卡：状态管理与用户中心
│   │   ├── Day6_Evidence.md            # Day6 证据卡：交互优化与体验完善
│   │   └── Day7_Evidence.md            # Day7 证据卡：综合验收与项目展示
│   └── guide/
│       ├── Environment_Setup.md        # 环境配置指南
│       └── Getting_Started.md          # 快速开始指南
├── public/
│   └── favicon.ico
├── scripts/                            # 自动检测工具
├── src/
│   ├── api/                             # API 接口封装（按业务域划分）
│   │   ├── http.ts                      # Axios 实例封装
│   │   ├── trade.ts                     # 二手交易接口
│   │   ├── lostFound.ts                 # 失物招领接口
│   │   ├── groupBuy.ts                  # 拼单搭子接口
│   │   ├── errand.ts                    # 跑腿委托接口
│   │   ├── user.ts                      # 用户接口
│   │   ├── favorite.ts                  # 收藏接口
│   │   ├── message.ts                   # 消息接口
│   │   └── ...
│   ├── components/                      # 公共组件
│   │   ├── AppHeader.vue                # 顶部导航
│   │   ├── AppNav.vue                   # 导航菜单
│   │   ├── AppLayout.vue                # 布局容器
│   │   ├── ItemCard.vue                 # 商品卡片（通用）
│   │   ├── EmptyState.vue               # 空状态组件
│   │   ├── LoadingState.vue             # 加载状态组件
│   │   ├── ErrorState.vue               # 错误状态组件
│   │   ├── SearchBar.vue                # 搜索输入框组件
│   │   └── FormField.vue                # 表单字段组件
│   ├── composables/                     # 组合式函数
│   │   └── useReload.ts
│   ├── stores/                          # Pinia 状态管理
│   │   ├── user.ts                      # 用户状态 Store
│   │   └── favorite.ts                  # 收藏状态 Store
│   ├── views/                           # 页面组件
│   │   ├── HomeView.vue                 # 首页
│   │   ├── TradeView.vue                # 二手交易
│   │   ├── LostFoundView.vue            # 失物招领
│   │   ├── GroupBuyView.vue             # 拼单搭子
│   │   ├── ErrandView.vue               # 跑腿委托
│   │   ├── PublishView.vue              # 发布信息
│   │   ├── DetailView.vue               # 详情页
│   │   ├── ListView.vue                 # 列表页
│   │   ├── MessageView.vue              # 消息中心
│   │   ├── UserCenterView.vue           # 用户中心
│   │   ├── ProfileView.vue              # 个人主页
│   │   └── BoardView.vue                # 公告栏
│   ├── router/
│   │   └── index.ts                     # 路由配置
│   ├── App.vue                          # 根组件（含全局设计系统）
│   └── main.ts                          # 入口文件
├── db.json                              # Mock 数据库
├── .eslint.config.ts                    # ESLint 配置
├── .oxlintrc.json                       # Oxlint 配置
├── tsconfig.json                        # TypeScript 配置
├── vite.config.ts                       # Vite 配置
├── package.json                         # 项目配置
└── README.md                            # 项目说明
```

---

## 每日开发记录

| 天数 | 主题 | 核心内容 |
|------|------|----------|
| Day1 | 项目启动与业务梳理 | 业务场景分析、页面清单、技术选型 |
| Day2 | 页面骨架与路由导航 | 12 个页面创建、路由配置、公共布局 |
| Day3 | Mock 数据与列表渲染 | JSON Server 数据建模、API 封装、列表展示 |
| Day4 | 发布表单与数据新增 | 动态表单、表单校验、数据提交 |
| Day5 | 状态管理与用户中心 | Pinia Store、用户中心、收藏功能 |
| Day6 | 交互优化与体验完善 | 加载/空/错状态、搜索筛选、表单体验优化 |
| Day7 | 综合验收与项目展示 | 构建检查、功能走查、文档整理、AI 复盘 |

详细记录见 `docs/evidence/` 目录下的每日证据卡。

---

## AI 协作说明

本项目在开发过程中使用 AI Coding 工具辅助完成以下工作：

- 页面骨架与路由配置生成
- Mock 数据结构设计与示例数据生成
- 组件基础代码编写
- 样式优化与设计系统应用
- 证据卡文档整理与结构化

开发者对 AI 生成内容进行了**人工审查、修改和取舍**，确保代码质量和业务逻辑的正确性。具体 AI 协作过程记录在 `docs/evidence/` 和 `docs/ai/` 中。

### AI 使用原则

1. **明确边界**：清楚告知 AI 项目约束和范围，避免过度设计
2. **小块迭代**：分段修改代码，便于控制和验证
3. **交叉验证**：AI 方案需经人工思考和测试验证
4. **保留判断**：业务逻辑、架构设计等核心决策由人工完成
5. **重在效率**：AI 用于提高效率（样板代码、文档、排查思路），不代替思考

---

## 设计系统

项目采用极简主义（Brutally Minimal）设计风格：

- **配色**：黑白灰为主，单一强调色点缀
- **布局**：大量留白，1400px 最大容器宽度
- **边框**：细边框，无阴影，4px 圆角
- **字体**：系统字体栈，清晰易读
- **动效**：极其克制，仅关键交互点添加微妙过渡

全局设计变量定义在 `src/App.vue` 的 CSS 变量中。

---

## 当前不足与改进方向

### 当前不足

1. 后端使用 JSON Server 模拟，非真实后端服务
2. 用户状态为模拟数据，无真实登录注册流程
3. 搜索功能较基础，缺少高级筛选、排序、分页
4. 部分 TypeScript 类型使用 any，类型安全待提升
5. 主要针对桌面端设计，移动端响应式适配尚未完成
6. 图片上传功能未实现，目前使用 URL 输入
7. 消息中心为静态数据，无实时通信能力

### 后续改进方向

1. 接入真实后端（Node.js / Python / Java）
2. 完善用户系统（注册、登录、头像上传）
3. 增强搜索筛选（多条件组合、排序、分页、价格区间）
4. 提升 TypeScript 类型安全
5. 响应式适配移动端
6. 添加图片上传功能
7. 实现实时消息推送
8. 补充单元测试和端到端测试

---

## License

本项目仅用于《校园轻集市》课程教学与实践。
