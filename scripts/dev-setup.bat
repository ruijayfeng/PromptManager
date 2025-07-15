@echo off
REM PromptManager Windows 开发环境设置脚本

echo 🚀 设置 PromptManager 开发环境 (Windows)...

REM 检查必要工具
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 需要安装 Python 3.11+
    pause
    exit /b 1
)

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 需要安装 Node.js 18+
    pause
    exit /b 1
)

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 需要安装 npm
    pause
    exit /b 1
)

REM 复制环境变量模板
if not exist .env (
    copy .env.example .env
    echo ✅ 已创建后端环境配置文件 .env
)

if not exist frontend\.env (
    copy frontend\.env.example frontend\.env
    echo ✅ 已创建前端环境配置文件 frontend\.env
)

REM 安装后端依赖
echo 📦 安装后端依赖...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
echo ✅ 后端依赖安装完成

REM 初始化数据库
echo 🗄️ 初始化数据库...
python -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine); print('数据库初始化完成')"

cd ..

REM 安装前端依赖
echo 📦 安装前端依赖...
cd frontend
npm install
echo ✅ 前端依赖安装完成

cd ..

echo 🎉 开发环境设置完成！
echo.
echo 启动命令：
echo   后端: cd backend ^&^& venv\Scripts\activate ^&^& uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
echo   前端: cd frontend ^&^& npm run dev
echo   Docker: docker-compose up --build
echo.
echo 访问地址：
echo   前端: http://localhost:3000
echo   后端API文档: http://localhost:8000/api/docs
echo.
pause