@echo off
REM PromptManager Windows 开发服务启动脚本

echo 🚀 启动 PromptManager 开发服务...

REM 检查环境是否已设置
if not exist backend\venv (
    echo ❌ 开发环境未设置，请先运行 dev-setup.bat
    pause
    exit /b 1
)

REM 启动后端服务 (在新窗口)
echo 📡 启动后端服务...
start "PromptManager Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM 等待后端启动
timeout /t 3 /nobreak >nul

REM 启动前端服务 (在新窗口)
echo 🌐 启动前端服务...
start "PromptManager Frontend" cmd /k "cd frontend && npm run dev"

echo ✅ 服务启动完成！
echo.
echo 访问地址：
echo   前端: http://localhost:3000
echo   后端API文档: http://localhost:8000/api/docs
echo.
echo 按任意键关闭此窗口...
pause >nul