# PromptManager - AI提示词管理平台

一个轻量级的AI提示词存储、组织和管理平台，采用现代化的全栈技术架构，提供优雅的用户界面和强大的功能体验。

## ✨ 功能特性

### 🔐 用户认证系统
- JWT令牌认证，安全可靠
- 用户注册和登录管理
- 路由保护和权限控制

### 📝 Prompt管理
- 完整的增删改查操作
- 支持Markdown格式编辑
- 实时预览和分屏模式
- 语法高亮和工具栏支持

### 🏷️ 分类和标签
- 多层级分类组织
- 颜色标记的标签系统
- 智能筛选和组合搜索
- 一键快速创建

### 🔍 全文搜索
- 支持标题、内容、描述搜索
- 高级筛选（分类、状态、收藏）
- 动态排序（时间、热度、标题）
- 实时搜索建议

### 📤 导入导出
- JSON格式：保留完整元数据
- Markdown格式：便于阅读分享
- 批量操作和选择导出
- 智能解析和错误处理

### ⭐ 收藏分享
- 一键收藏常用提示词
- 公开分享优质内容
- 热门排序发现精选
- 社区共享机制

### 📊 统计分析
- 个人使用数据仪表板
- 创建趋势和活跃度分析
- 内容长度分布统计
- 标签使用频率分析

### 🎨 主题系统
- Claude风格设计语言
- 深色/浅色主题切换
- 系统主题自动跟随
- 完全响应式设计

## 🛠️ 技术栈

### 后端 (FastAPI)
- **框架**: FastAPI 0.104+
- **数据库**: SQLAlchemy ORM + SQLite/PostgreSQL
- **认证**: JWT + bcrypt密码加密
- **验证**: Pydantic数据验证
- **文档**: 自动生成API文档

### 前端 (React + TypeScript)
- **框架**: React 18 + TypeScript
- **构建**: Vite 5.0+
- **样式**: Tailwind CSS + Claude设计系统
- **状态**: Zustand状态管理
- **路由**: React Router v6
- **编辑器**: 自定义Markdown编辑器
- **图标**: Lucide React

### 部署和工具
- **容器化**: Docker + Docker Compose
- **开发**: 热重载 + 类型检查
- **生产**: 多阶段构建优化

## 🚀 快速开始

### 方式一：自动化脚本（推荐）

```bash
# 克隆项目
git clone <repository-url>
cd PromptManager

# 运行开发环境设置脚本
./scripts/dev-setup.sh

# 启动后端服务
cd backend && source venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 启动前端服务
cd frontend && npm run dev
```

### 方式二：Docker容器（推荐用于快速体验）

```bash
# 开发环境
docker-compose up --build

# 生产环境
docker-compose -f docker-compose.prod.yml up -d
```

### 方式三：手动安装

#### 后端设置

```bash
cd backend

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp ../.env.example .env
# 编辑 .env 文件，设置SECRET_KEY等

# 初始化数据库
python -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine)"

# 启动服务
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置VITE_API_URL

# 启动开发服务
npm run dev

# 构建生产版本
npm run build
```

## 📖 使用指南

### 基础操作

1. **注册账户**: 访问 `/register` 创建新账户
2. **登录系统**: 使用用户名和密码登录
3. **创建提示词**: 点击"新建提示词"开始创建
4. **组织管理**: 使用分类和标签整理你的提示词
5. **搜索发现**: 使用搜索栏快速找到需要的内容

### 高级功能

- **Markdown编辑**: 支持完整的Markdown语法，实时预览
- **批量导出**: 选择多个提示词一键导出
- **公开分享**: 将优质提示词设为公开，供他人参考
- **数据分析**: 查看个人使用统计和趋势分析

## 📁 项目结构

```
PromptManager/
├── backend/                 # FastAPI后端
│   ├── app/
│   │   ├── models/         # 数据库模型
│   │   ├── routers/        # API路由
│   │   ├── schemas/        # Pydantic模式
│   │   ├── utils/          # 工具函数
│   │   └── main.py         # 应用入口
│   └── requirements.txt    # Python依赖
├── frontend/               # React前端
│   ├── src/
│   │   ├── components/     # 组件库
│   │   ├── pages/          # 页面组件
│   │   ├── stores/         # 状态管理
│   │   ├── services/       # API服务
│   │   └── types/          # TypeScript类型
│   └── package.json        # Node.js依赖
├── scripts/                # 自动化脚本
├── docker-compose.yml      # 开发环境
├── docker-compose.prod.yml # 生产环境
└── README.md              # 项目文档
```

## 🔧 配置选项

### 环境变量

#### 后端配置 (.env)
```bash
DATABASE_URL=sqlite:///./prompt_manager.db
SECRET_KEY=your-secret-key
ALLOWED_ORIGINS=http://localhost:3000
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### 前端配置 (frontend/.env)
```bash
VITE_API_URL=http://localhost:8000
VITE_DEBUG=false
```

### 数据库配置

支持SQLite（开发）和PostgreSQL（生产）：

```bash
# SQLite（默认）
DATABASE_URL=sqlite:///./prompt_manager.db

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost/prompt_manager
```

## 🚀 部署指南

### 开发环境

```bash
# 使用Docker Compose
docker-compose up --build

# 或者分别启动
./scripts/dev-setup.sh
```

### 生产环境

```bash
# 构建生产版本
./scripts/build-prod.sh

# 部署服务
docker-compose -f docker-compose.prod.yml up -d

# 查看服务状态
docker-compose -f docker-compose.prod.yml ps
```

### 推荐部署平台

- **Railway**: 支持自动CI/CD
- **Render**: 免费层级支持
- **Vercel**: 前端托管（需配合后端API）
- **Fly.io**: 全栈部署，SQLite持久化

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交变更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📄 开源协议

本项目采用 MIT 协议，详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [FastAPI](https://fastapi.tiangolo.com/) - 现代高性能Web框架
- [React](https://reactjs.org/) - 用户界面构建库
- [Tailwind CSS](https://tailwindcss.com/) - 原子化CSS框架
- [Lucide](https://lucide.dev/) - 美观的开源图标库

---

⭐ 如果这个项目对你有帮助，欢迎给个Star！