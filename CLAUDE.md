# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a lightweight Prompt Management website for storing, organizing and managing AI prompts. The project uses a modern full-stack architecture with Python FastAPI backend and React TypeScript frontend, designed for easy deployment and low-concurrency scenarios.

## Architecture

### Tech Stack
- **Backend**: Python 3.11+ with FastAPI, SQLAlchemy ORM, SQLite database
- **Frontend**: React 18 + TypeScript with Vite build tool
- **UI**: Tailwind CSS with Claude-inspired design system
- **Markdown**: react-markdown with extensive plugin ecosystem for rich rendering
- **Deployment**: Docker containers with one-click deployment options

### Directory Structure
```
prompt-manager/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components organized by feature
│   │   │   ├── markdown/  # Markdown rendering components
│   │   │   ├── editor/    # Editor components with real-time preview
│   │   │   ├── ui/        # Basic UI components following Claude design
│   │   │   └── layout/    # Layout components
│   │   ├── pages/         # Route-level page components
│   │   ├── stores/        # State management (Zustand/Redux Toolkit)
│   │   ├── styles/        # Theme configuration and CSS
│   │   └── types/         # TypeScript type definitions
├── backend/               # Python FastAPI backend
│   ├── app/
│   │   ├── models/        # SQLAlchemy database models
│   │   ├── routers/       # API route handlers
│   │   ├── schemas/       # Pydantic validation schemas
│   │   ├── services/      # Business logic layer
│   │   └── utils/         # Utility functions
└── deploy/                # Deployment configurations
```

## Development Commands

### 🚀 **推荐启动方式（已验证可完全使用）**

**重要提示**：请按照以下顺序启动，确保前后端正常通信和用户认证功能：

#### Step 1: 启动后端服务
```bash
cd backend && python start.py
```
- 后端运行在：http://localhost:8001
- API文档：http://localhost:8001/api/docs
- 健康检查：http://localhost:8001/api/health

#### Step 2: 启动前端服务
```bash
cd frontend && npm run dev
```
- 前端自动分配端口（通常是 5173, 5174, 5175... 等）
- 通过Vite代理访问后端API
- 支持热重载开发

#### Step 3: 验证功能
访问前端地址（如 http://localhost:5178），验证：
- ✅ 用户注册功能正常
- ✅ 用户登录功能正常  
- ✅ 可以进入主页面 `/prompts`
- ✅ 所有API通信正常

### 传统启动方式（备用）

#### Backend (FastAPI)
```bash
# Install dependencies
cd backend && pip install -r requirements.txt

# Run development server (alternative)
cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

# Database migration (when using Alembic)
cd backend && alembic revision --autogenerate -m "description"
cd backend && alembic upgrade head
```

#### Frontend (React)
```bash
# Install dependencies
cd frontend && npm install

# Build for production
cd frontend && npm run build

# Preview production build
cd frontend && npm run preview
```

### Full Stack Development
```bash
# Run both frontend and backend with Docker
docker-compose up --build

# Run in development mode with hot reload
docker-compose -f docker-compose.dev.yml up
```

## Design System & Styling

### Claude-Inspired Design
- **Typography**: Inter for UI text, JetBrains Mono for code
- **Colors**: 
  - Primary: #1a1a1a (dark) / #ffffff (light)
  - Accent: #e07a47 (orange) / #0066cc (blue)
  - Background: #fafafa (light gray) / #0f0f0f (dark gray)
- **Spacing**: 8px grid system
- **Typography**: 1.6 line height, 16px base font size
- **Border Radius**: 8px/12px consistent rounded corners

### Markdown Rendering
The project emphasizes rich Markdown support with:
- Real-time preview with split-screen editing
- Syntax highlighting for 100+ languages via Prism.js
- Math formula rendering with KaTeX
- Mermaid diagram support
- Table beautification and task list support

Key Markdown packages:
- `react-markdown` with `remark-gfm`, `remark-math`
- `rehype-katex`, `rehype-highlight`
- `@tailwindcss/typography` for prose styling

## Database Schema

### Core Models
- **Users**: id, username, email, password_hash, timestamps
- **Prompts**: id, title, content (markdown), description, category_id, user_id, is_public, timestamps
- **Categories**: id, name, description, user_id, created_at
- **Tags**: id, name, created_at
- **PromptTags**: Many-to-many relationship table

## 🔧 **重要技术要点和问题解决记录**

### 已解决的关键问题
1. **Network Error问题**：
   - 问题：前端直接访问API URL导致跨域问题
   - 解决：使用Vite代理，前端通过相对路径访问API
   - 配置：注释掉`.env`中的`VITE_API_URL`，使用空baseURL

2. **Not authenticated问题**：
   - 问题：axios拦截器给所有请求添加认证头
   - 解决：区分公共端点，只对需要认证的端点添加Authorization头
   - 配置：`['/api/auth/register', '/api/auth/login', '/api/health']`为公共端点

3. **登录后认证失败**：
   - 问题：前端状态管理时序问题，token未及时设置
   - 解决：在获取用户信息前先设置token到状态中
   - 关键：确保axios拦截器能获取到token

### 端口配置
- **后端固定端口**：8001
- **前端动态端口**：5173, 5174, 5175...（自动分配）
- **CORS配置**：支持所有常用端口
- **代理配置**：前端通过Vite代理访问后端

### 认证机制
- **JWT认证**：30分钟有效期
- **密码加密**：bcrypt哈希算法
- **状态管理**：Zustand持久化存储
- **路由守护**：自动重定向到登录页

## Development Workflow

### Recommended Implementation Order
1. **Project Setup**: Configuration files, directory structure, database models
2. **Authentication**: JWT-based auth system with login/register
3. **Core CRUD**: Prompt management APIs and frontend pages
4. **Markdown System**: Editor components with real-time preview
5. **UI Polish**: Claude-inspired theme and component library
6. **Advanced Features**: Search, import/export, tagging
7. **Deployment**: Docker configuration and platform deployment

### Quality Standards
- TypeScript strict mode with complete type definitions
- Claude design system consistency
- Markdown rendering performance optimization
- Error handling with user-friendly feedback
- Mobile-responsive design

### Git Commit Rules
**IMPORTANT**: After completing each major development phase, you MUST automatically create a git commit with accurate Chinese version descriptions:

Example commit messages for each phase:
1. **项目基础搭建**: "feat: 完成项目基础架构搭建 - 配置FastAPI后端和React前端基础框架"
2. **认证系统**: "feat: 实现用户认证系统 - JWT登录注册功能完成"
3. **核心CRUD**: "feat: 完成Prompt核心功能 - 增删改查API和前端页面实现"
4. **Markdown系统**: "feat: 实现Markdown编辑器 - 支持实时预览和语法高亮"
5. **UI主题**: "feat: 完成Claude风格主题系统 - 统一设计语言和组件库"
6. **高级功能**: "feat: 实现搜索和导入导出 - 全文搜索和文件处理功能"
7. **部署配置**: "feat: 完成部署配置 - Docker容器化和一键部署支持"

Commit message format:
- Use `feat:` prefix for new features
- Use `fix:` prefix for bug fixes  
- Use `refactor:` prefix for code refactoring
- Include detailed Chinese description of what was implemented
- Mention key technical achievements in each commit

## Deployment Options

### One-Click Deployment Platforms
- **Railway**: Auto CI/CD for Python + Node.js
- **Render**: Free tier with Docker support
- **Vercel**: Frontend deployment (pair with Railway backend)
- **Fly.io**: Full-stack with SQLite persistence

### Docker Deployment
- `Dockerfile.frontend` and `Dockerfile.backend` for containerization
- `docker-compose.yml` for local development
- Production-optimized compose file for deployment

## API Documentation

FastAPI automatically generates interactive API documentation at `/docs` endpoint. The backend uses:
- Pydantic schemas for request/response validation
- SQLAlchemy models for database operations
- JWT tokens for authentication
- CORS middleware for frontend integration