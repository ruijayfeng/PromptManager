import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Database URL - 支持SQLite和PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./prompt_manager.db")

# 配置引擎参数
if DATABASE_URL.startswith("sqlite"):
    # SQLite配置
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False,  # 生产环境关闭SQL日志
        pool_pre_ping=True,
        pool_recycle=3600
    )
else:
    # PostgreSQL配置
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        pool_recycle=3600
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """数据库依赖注入"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()