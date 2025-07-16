# 版本修复和解决方法文档

本文档记录了PromptManager项目在不同版本中遇到的问题及其解决方案，为后续开发和部署提供参考。

## 📋 版本历史

### v1.0.0 - 基础版本 (2024-07-16)
**提交ID**: `ae7aeee`
**状态**: ✅ Windows环境测试通过

#### 🐛 遇到的问题
1. **Pydantic v2兼容性问题**
   - 错误: `regex` is removed. use `pattern` instead
   - 影响文件: `schemas/category.py`, `schemas/tag.py`

2. **前端JSX语法错误**
   - 错误: The character ">" is not valid inside a JSX element
   - 影响文件: `components/markdown/MarkdownEditor.tsx`

3. **CSS循环依赖问题**
   - 错误: You cannot `@apply` the `prose` utility here because it creates a circular dependency
   - 影响文件: `styles/globals.css`

4. **Python依赖编译问题**
   - 错误: pydantic-core需要Rust编译环境
   - 影响: 无法正常安装完整依赖

#### ✅ 解决方案
1. **修复Pydantic v2兼容性**
   ```python
   # 修改前
   color: str = Field("#e07a47", regex="^#[0-9a-fA-F]{6}$")
   
   # 修改后  
   color: str = Field("#e07a47", pattern="^#[0-9a-fA-F]{6}$")
   ```

2. **修复JSX语法错误**
   ```tsx
   // 修改前
   <div>> 引用</div>
   
   // 修改后
   <div>{'>'} 引用</div>
   ```

3. **修复CSS循环依赖**
   ```css
   /* 修改前 */
   .prose {
     @apply prose-primary dark:prose-invert;
   }
   
   /* 修改后 */
   .prose {
     @apply dark:prose-invert prose-headings:font-semibold;
   }
   ```

4. **简化Python依赖**
   ```bash
   # 创建简化版依赖列表
   pip install fastapi==0.104.1 uvicorn==0.24.0 sqlalchemy==1.4.50 \
               python-jose==3.3.0 passlib==1.7.4 python-multipart==0.0.6 \
               python-dotenv==1.0.0 email-validator
   ```

---

### v1.1.0 - 网络连接修复版本 (2024-07-16)
**提交ID**: `[当前版本]`
**状态**: ✅ 完全可运行

#### 🐛 遇到的问题
1. **Network Error - CORS配置问题**
   - 错误: 前端无法连接后端API
   - 原因: 后端只允许port 3000，前端运行在port 5173

2. **bcrypt依赖缺失**
   - 错误: bcrypt: no backends available
   - 影响: 用户注册/登录功能无法正常工作

3. **端口冲突问题**
   - 错误: 端口被占用导致服务启动失败
   - 影响: 后端服务无法正常启动

#### ✅ 解决方案
1. **修复CORS配置**
   ```python
   # 在 backend/app/main.py 中修改
   allowed_origins = os.getenv("ALLOWED_ORIGINS", 
       "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173").split(",")
   ```

2. **安装bcrypt依赖**
   ```bash
   cd backend
   pip install bcrypt
   ```

3. **配置端口映射**
   ```bash
   # 前端配置 (frontend/.env)
   VITE_API_URL=http://localhost:8003
   
   # 后端启动
   python -c "
   import uvicorn
   from app.main import app
   uvicorn.run(app, host='0.0.0.0', port=8003)
   "
   ```

4. **数据库初始化测试**
   ```python
   # 创建 test_db.py 进行数据库连接测试
   from app.database import engine, Base
   Base.metadata.create_all(bind=engine)
   ```

---

## 🚀 当前稳定启动方法

### 环境要求
- Python 3.11+
- Node.js 16+
- Git

### 完整启动流程

#### 1. 后端启动
```bash
cd backend

# 安装依赖
pip install fastapi==0.104.1 uvicorn==0.24.0 sqlalchemy==1.4.50 \
            python-jose==3.3.0 passlib==1.7.4 python-multipart==0.0.6 \
            python-dotenv==1.0.0 email-validator bcrypt

# 启动服务
python -c "
import uvicorn
from app.main import app
uvicorn.run(app, host='0.0.0.0', port=8003)
"
```

#### 2. 前端启动 (新终端)
```bash
cd frontend

# 配置API地址
echo VITE_API_URL=http://localhost:8003 > .env

# 安装依赖
npm install

# 启动服务
npm run dev -- --port 5173
```

#### 3. 访问地址
- 🌐 前端界面: http://localhost:5173
- 🔧 后端API: http://localhost:8003
- 📚 API文档: http://localhost:8003/api/docs

---

## 🔧 常见问题排查

### Network Error 排查步骤
1. **检查后端服务状态**
   ```bash
   curl http://localhost:8003/api/health
   ```

2. **检查CORS配置**
   - 确认 `backend/app/main.py` 中包含前端端口
   - 确认前端 `.env` 文件中API地址正确

3. **检查端口占用**
   ```bash
   netstat -ano | findstr :8003
   netstat -ano | findstr :5173
   ```

### 数据库问题排查
1. **运行数据库测试**
   ```bash
   cd backend
   python test_db.py
   ```

2. **检查数据库文件**
   - 确认 `backend/prompt_manager.db` 文件存在
   - 检查文件权限

### 前端编译问题
1. **清理缓存**
   ```bash
   cd frontend
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

2. **检查环境变量**
   ```bash
   # 确认 .env 文件存在且配置正确
   cat .env
   ```

---

## 📝 开发建议

### 1. 版本管理
- 每次重大修复后创建git标签
- 保持详细的commit消息
- 定期更新此文档

### 2. 依赖管理
- 使用固定版本号避免兼容性问题
- 定期检查依赖安全性
- 维护简化版和完整版依赖列表

### 3. 测试策略
- 每次修改后运行数据库测试
- 验证前后端连接正常
- 测试核心功能(注册/登录)

### 4. 部署准备
- 准备Docker配置用于生产环境
- 配置环境变量管理
- 准备自动化部署脚本

---

## 🎯 下一步计划

1. **完善Docker配置**
   - 解决容器化部署问题
   - 优化构建性能

2. **增强错误处理**
   - 更详细的错误信息
   - 用户友好的错误提示

3. **性能优化**
   - 前端代码分割
   - 数据库查询优化

4. **功能完善**
   - 完整的用户权限系统
   - 数据导入导出功能
   - 搜索功能优化

---

**最后更新**: 2024-07-16  
**维护者**: Claude Code Assistant  
**版本**: v1.1.0