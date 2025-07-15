#!/bin/bash

# PromptManager 生产环境构建脚本

echo "🏗️ 构建 PromptManager 生产版本..."

# 检查Docker是否安装
command -v docker >/dev/null 2>&1 || { echo "❌ 需要安装 Docker"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ 需要安装 Docker Compose"; exit 1; }

# 创建生产环境配置
if [ ! -f .env.prod ]; then
    echo "⚠️ 创建生产环境配置文件..."
    cat > .env.prod << EOF
DATABASE_URL=postgresql://prompt_user:prompt_password@db:5432/prompt_manager
SECRET_KEY=$(openssl rand -hex 32)
ALLOWED_ORIGINS=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com
EOF
    echo "✅ 已创建 .env.prod，请根据实际环境修改配置"
fi

# 构建Docker镜像
echo "📦 构建Docker镜像..."
docker-compose -f docker-compose.prod.yml build

echo "✅ 生产版本构建完成！"
echo ""
echo "部署命令："
echo "  docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "管理命令："
echo "  查看日志: docker-compose -f docker-compose.prod.yml logs -f"
echo "  停止服务: docker-compose -f docker-compose.prod.yml down"
echo "  重启服务: docker-compose -f docker-compose.prod.yml restart"