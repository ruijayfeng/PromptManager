#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import engine, Base, get_db, SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.auth import get_password_hash

def test_database():
    print("Testing database connection...")
    
    # 创建所有表
    try:
        Base.metadata.create_all(bind=engine)
        print("OK - Database tables created successfully")
    except Exception as e:
        print(f"ERROR - Error creating tables: {e}")
        return
    
    # 测试数据库连接
    try:
        db = SessionLocal()
        # 简单查询测试
        users = db.query(User).all()
        print(f"OK - Database connection successful, found {len(users)} users")
        db.close()
    except Exception as e:
        print(f"ERROR - Database connection error: {e}")
        return
    
    # 测试用户创建
    try:
        db = SessionLocal()
        
        # 检查是否已存在测试用户
        existing_user = db.query(User).filter(User.username == "testuser").first()
        if existing_user:
            print("OK - Test user already exists")
        else:
            # 创建测试用户
            hashed_password = get_password_hash("testpass")
            test_user = User(
                username="testuser",
                email="test@example.com", 
                password_hash=hashed_password
            )
            db.add(test_user)
            db.commit()
            print("OK - Test user created successfully")
        
        db.close()
    except Exception as e:
        print(f"ERROR - Error creating user: {e}")

if __name__ == "__main__":
    test_database()