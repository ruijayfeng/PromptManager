# Prompt管理网站开发路线

## 项目概述
开发一个轻量级的Prompt管理网站，用于存储、管理和组织AI提示词，适合个人或小团队使用。

## 技术栈选择

### 前端 (丰富的用户体验)
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Ant Design / Tailwind CSS
- **状态管理**: Zustand / Redux Toolkit
- **路由**: React Router
- **HTTP客户端**: Axios
- **代码编辑器**: Monaco Editor (支持Prompt语法高亮)
- **拖拽**: react-beautiful-dnd
- **图表**: Chart.js / Recharts
- **动画**: Framer Motion

#### Markdown渲染和展示
- **Markdown解析**: react-markdown + remark/rehype插件
- **语法高亮**: Prism.js / highlight.js
- **数学公式**: KaTeX
- **代码块**: 支持多语言语法高亮
- **字体系统**: 
  - 主字体: Inter (无衬线，现代感)
  - 代码字体: JetBrains Mono / Fira Code (连字支持)
  - 中文字体: -apple-system, "Noto Sans SC", "PingFang SC"

#### Claude风格设计
- **配色方案**: 
  - 主色调: #1a1a1a (深色) / #ffffff (浅色)
  - 强调色: #e07a47 (橙色) / #0066cc (蓝色)
  - 背景色: #fafafa (浅灰) / #0f0f0f (深灰)
- **排版**: 行高1.6，字体大小16px基准，响应式缩放
- **间距系统**: 8px基准网格
- **圆角**: 8px / 12px 统一圆角
- **阴影**: 微妙的投影效果，增强层次感

### 后端 (Python轻量级)
- **语言**: Python 3.11+
- **框架**: FastAPI (现代、快速、易部署)
- **数据库**: SQLite (轻量级，适合低并发)
- **ORM**: SQLAlchemy
- **认证**: JWT + Passlib
- **数据验证**: Pydantic
- **API文档**: 自动生成 (FastAPI内置)

### 部署 (便捷上线)
- **容器化**: Docker + Docker Compose
- **部署平台**: 
  - 一键部署: Railway / Render / Vercel
  - VPS: Ubuntu + Nginx + Gunicorn
  - 云服务: AWS EC2 / 阿里云ECS
- **域名**: 支持自定义域名绑定

## 核心功能规划

### Phase 1: 基础功能 (MVP)
- [ ] 用户注册/登录
- [ ] Prompt CRUD操作
  - [ ] 创建Prompt
  - [ ] 查看Prompt列表
  - [ ] 编辑Prompt
  - [ ] 删除Prompt
- [ ] 基础分类管理
- [ ] 简单搜索功能

### Phase 2: 增强功能
- [ ] 标签系统 (支持拖拽管理)
- [ ] 高级搜索和筛选 (全文搜索)
- [ ] Prompt版本管理 (Git-like版本控制)
- [ ] 导入/导出功能 (JSON/CSV/Markdown)
- [ ] 收藏和星标功能
- [ ] 使用统计和分析图表
- [ ] 语法高亮和代码编辑器
- [ ] 实时预览功能

#### Markdown增强功能
- [ ] Markdown实时预览 (分屏显示)
- [ ] 数学公式渲染 (LaTeX语法)
- [ ] 代码块语法高亮 (支持100+语言)
- [ ] 表格美化渲染
- [ ] 任务列表支持 (checkbox)
- [ ] 脚注和引用支持
- [ ] 图片粘贴和托管
- [ ] Mermaid图表支持
- [ ] 目录自动生成
- [ ] 全文搜索 (包含Markdown内容)

### Phase 3: 协作功能
- [ ] 团队管理
- [ ] 权限控制
- [ ] Prompt分享
- [ ] 评论系统

## 数据库设计

### 主要表结构
```sql
-- 用户表
users (id, username, email, password_hash, created_at, updated_at)

-- Prompt表
prompts (id, title, content, description, category_id, user_id, is_public, created_at, updated_at)

-- 分类表
categories (id, name, description, user_id, created_at)

-- 标签表
tags (id, name, created_at)

-- Prompt标签关联表
prompt_tags (prompt_id, tag_id)
```

## 代码生成工作流程

### 第一步: 项目基础搭建
#### 1.1 创建项目结构和配置文件
- [ ] 生成 `package.json` (frontend)
- [ ] 生成 `requirements.txt` (backend)
- [ ] 创建 `docker-compose.yml`
- [ ] 配置 `vite.config.ts`
- [ ] 配置 `tailwind.config.js`
- [ ] 创建基础目录结构

#### 1.2 后端核心架构
- [ ] 创建 `backend/app/main.py` (FastAPI应用入口)
- [ ] 创建 `backend/app/database.py` (SQLite配置)
- [ ] 创建 `backend/app/models/user.py` (用户模型)
- [ ] 创建 `backend/app/models/prompt.py` (Prompt模型)
- [ ] 创建 `backend/app/schemas/` (Pydantic模式)

#### 1.3 前端基础框架
- [ ] 创建 `frontend/src/App.tsx` (主应用组件)
- [ ] 创建 `frontend/src/main.tsx` (应用入口)
- [ ] 创建路由配置 `frontend/src/router/index.ts`
- [ ] 创建主题配置 `frontend/src/styles/theme.ts`
- [ ] 创建基础布局组件

### 第二步: 认证系统实现
#### 2.1 后端认证
- [ ] 创建 `backend/app/routers/auth.py` (登录注册API)
- [ ] 创建 `backend/app/utils/auth.py` (JWT工具函数)
- [ ] 创建 `backend/app/middleware/auth.py` (认证中间件)

#### 2.2 前端认证
- [ ] 创建 `frontend/src/stores/auth.ts` (认证状态管理)
- [ ] 创建 `frontend/src/components/auth/LoginForm.tsx`
- [ ] 创建 `frontend/src/components/auth/RegisterForm.tsx`
- [ ] 创建 `frontend/src/hooks/useAuth.ts`

### 第三步: Prompt核心功能
#### 3.1 后端API实现
- [ ] 创建 `backend/app/routers/prompts.py` (Prompt CRUD API)
- [ ] 创建 `backend/app/services/prompt_service.py` (业务逻辑)
- [ ] 创建 `backend/app/routers/categories.py` (分类管理API)

#### 3.2 前端Prompt管理
- [ ] 创建 `frontend/src/pages/PromptList.tsx` (Prompt列表页)
- [ ] 创建 `frontend/src/pages/PromptDetail.tsx` (Prompt详情页)
- [ ] 创建 `frontend/src/components/prompt/PromptCard.tsx`
- [ ] 创建 `frontend/src/stores/prompt.ts` (Prompt状态管理)

### 第四步: Markdown编辑器和渲染
#### 4.1 Markdown编辑器组件
- [ ] 创建 `frontend/src/components/editor/MarkdownEditor.tsx`
- [ ] 创建 `frontend/src/components/editor/EditorToolbar.tsx`
- [ ] 创建 `frontend/src/hooks/useMarkdownEditor.ts`

#### 4.2 Markdown渲染组件
- [ ] 创建 `frontend/src/components/markdown/MarkdownRenderer.tsx`
- [ ] 创建 `frontend/src/components/markdown/CodeBlock.tsx`
- [ ] 创建 `frontend/src/styles/markdown.css` (Claude风格样式)
- [ ] 配置Prism.js语法高亮主题

#### 4.3 实时预览功能
- [ ] 创建 `frontend/src/components/editor/PreviewPane.tsx`
- [ ] 创建分屏编辑器布局组件
- [ ] 实现滚动同步功能

### 第五步: UI/UX和主题系统
#### 5.1 Claude风格主题
- [ ] 创建 `frontend/src/styles/themes/claude.ts`
- [ ] 配置Inter和JetBrains Mono字体
- [ ] 创建颜色系统和设计token
- [ ] 实现暗色/亮色主题切换

#### 5.2 核心UI组件
- [ ] 创建 `frontend/src/components/ui/Button.tsx`
- [ ] 创建 `frontend/src/components/ui/Input.tsx`
- [ ] 创建 `frontend/src/components/ui/Modal.tsx`
- [ ] 创建 `frontend/src/components/ui/SearchBar.tsx`

### 第六步: 高级功能实现
#### 6.1 搜索和筛选
- [ ] 创建全文搜索API `backend/app/routers/search.py`
- [ ] 创建搜索组件 `frontend/src/components/search/SearchResults.tsx`
- [ ] 实现标签筛选功能

#### 6.2 导入导出功能
- [ ] 创建导出API `backend/app/routers/export.py`
- [ ] 创建导入组件 `frontend/src/components/import/FileUpload.tsx`
- [ ] 支持JSON/Markdown格式

### 第七步: 部署配置
#### 7.1 Docker配置
- [ ] 创建 `Dockerfile.frontend`
- [ ] 创建 `Dockerfile.backend`
- [ ] 优化 `docker-compose.yml` 生产配置

#### 7.2 部署脚本
- [ ] 创建 `deploy/railway.json`
- [ ] 创建 `deploy/render.yaml`
- [ ] 创建 `scripts/build.sh` 构建脚本

## 项目结构建议

```
prompt-manager/
├── frontend/              # React前端
│   ├── src/
│   │   ├── components/    # 可复用组件
│   │   │   ├── markdown/  # Markdown渲染组件
│   │   │   ├── editor/    # 编辑器组件
│   │   │   ├── ui/        # 基础UI组件
│   │   │   └── layout/    # 布局组件
│   │   ├── pages/         # 页面组件
│   │   ├── stores/        # 状态管理
│   │   ├── hooks/         # 自定义Hooks
│   │   ├── services/      # API服务
│   │   ├── utils/         # 工具函数
│   │   ├── styles/        # 样式文件
│   │   │   ├── themes/    # 主题配置
│   │   │   ├── fonts/     # 字体文件
│   │   │   └── markdown.css # Markdown样式
│   │   └── types/         # TypeScript类型
│   ├── package.json
│   └── vite.config.ts
├── backend/               # Python FastAPI后端
│   ├── app/
│   │   ├── main.py        # 应用入口
│   │   ├── models/        # SQLAlchemy模型
│   │   ├── routers/       # 路由处理
│   │   ├── schemas/       # Pydantic模式
│   │   ├── services/      # 业务逻辑
│   │   ├── utils/         # 工具函数
│   │   └── database.py    # 数据库配置
│   ├── requirements.txt
│   └── alembic/           # 数据库迁移
├── docker-compose.yml     # 容器编排
├── Dockerfile.frontend    # 前端容器
├── Dockerfile.backend     # 后端容器
├── deploy/                # 部署脚本
│   ├── railway.json       # Railway配置
│   ├── render.yaml        # Render配置
│   └── nginx.conf         # Nginx配置
└── README.md
```

## 预估工期
- **总开发时间**: 8-12天
- **适合人员**: 1-2名全栈开发者
- **难度级别**: 中等

## 快速部署方案

### 一键部署选项
1. **Railway**: 支持Python和Node.js，自动CI/CD
2. **Render**: 免费套餐，支持Docker部署
3. **Vercel**: 前端部署，配合Railway后端
4. **Fly.io**: 全栈部署，支持SQLite持久化

### 部署优势
- **FastAPI**: 自动生成API文档，易于调试
- **SQLite**: 单文件数据库，无需配置
- **Docker**: 统一环境，一键部署
- **静态资源**: 前端构建后可部署到CDN

## 开发优势
1. **Python生态**: 丰富的AI/ML库集成潜力
2. **FastAPI**: 现代异步框架，性能优异
3. **React**: 组件化开发，生态丰富
4. **TypeScript**: 类型安全，减少错误
5. **容器化**: 开发生产环境一致

## Markdown渲染优势
1. **专业级渲染**: 支持LaTeX、代码高亮、图表
2. **Claude风格**: 现代简洁的视觉设计
3. **响应式**: 适配桌面和移动端
4. **实时预览**: 所见即所得的编辑体验
5. **字体优化**: Inter + JetBrains Mono 专业字体组合

## 核心依赖包
```json
// 前端核心依赖
{
  "react-markdown": "^8.0.0",
  "remark-gfm": "^3.0.0", 
  "remark-math": "^5.1.0",
  "rehype-katex": "^6.0.0",
  "rehype-highlight": "^6.0.0",
  "prismjs": "^1.29.0",
  "@tailwindcss/typography": "^0.5.0"
}
```

## 代码生成执行顺序建议

### 推荐执行顺序
1. **先搭建基础**: 项目结构 → 配置文件 → 数据库模型
2. **后端优先**: FastAPI应用 → 认证系统 → 核心API
3. **前端核心**: 基础组件 → 页面路由 → 状态管理
4. **Markdown功能**: 编辑器 → 渲染器 → 主题样式
5. **功能完善**: 搜索 → 导入导出 → 部署配置

### 每步完成标准
- [ ] 代码可运行无错误
- [ ] 基础功能可验证
- [ ] 样式符合Claude风格
- [ ] TypeScript类型完整
- [ ] 简单测试通过

### 快速验证节点
1. **第一步完成**: 前后端能启动并连接数据库
2. **第二步完成**: 用户可以注册登录
3. **第三步完成**: Prompt的增删改查功能正常
4. **第四步完成**: Markdown编辑和预览正常
5. **第五步完成**: 界面美观,主题完整
6. **第六步完成**: 搜索和导入导出正常
7. **第七步完成**: 可以一键部署上线

### 注意事项
1. 每个文件都要包含完整的代码实现
2. 遵循TypeScript最佳实践
3. 确保Claude风格的视觉一致性
4. 优化Markdown渲染性能
5. 做好错误处理和用户反馈