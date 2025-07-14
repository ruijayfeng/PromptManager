# Prompt Manager

一个轻量级的AI提示词管理平台，支持Markdown编辑、实时预览和Claude风格的现代化界面。

## 技术栈

### 后端
- Python 3.11+ 
- FastAPI (异步Web框架)
- SQLAlchemy (ORM)
- SQLite (数据库)
- JWT认证

### 前端
- React 18 + TypeScript
- Vite (构建工具)
- Tailwind CSS (样式框架)
- Zustand (状态管理)
- react-markdown (Markdown渲染)

## 快速开始

### 使用Docker (推荐)

```bash
# 克隆项目
git clone <repository-url>
cd PromptManager

# 启动服务
docker-compose up --build
```

访问:
- 前端: http://localhost:3000
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/api/docs

### 本地开发

#### 后端

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 前端

```bash
cd frontend
npm install
npm run dev
```

## 功能特性

- ✅ 用户认证系统 (注册/登录)
- ✅ Prompt CRUD管理
- ✅ 分类系统
- ✅ 全文搜索
- ✅ 导入/导出 (JSON/Markdown)
- 🚧 Markdown实时预览
- 🚧 标签系统
- 🚧 Claude风格主题

## 项目结构

```
prompt-manager/
├── frontend/              # React前端应用
├── backend/               # FastAPI后端应用
├── docker-compose.yml     # Docker编排配置
└── README.md
```

## 开发指南

参考 [CLAUDE.md](./CLAUDE.md) 获取详细的开发指导。

## License

MIT