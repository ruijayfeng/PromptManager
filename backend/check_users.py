import sqlite3

def check_users():
    conn = sqlite3.connect('prompt_manager.db')
    cursor = conn.cursor()
    
    # 查看用户表结构
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    print("=== 用户表结构 ===")
    for col in columns:
        print(f"列名: {col[1]}, 类型: {col[2]}, 非空: {col[3]}, 默认值: {col[4]}")
    
    print("\n=== 注册用户列表 ===")
    cursor.execute('SELECT id, username, email, is_active, created_at FROM users')
    users = cursor.fetchall()
    
    if users:
        for user in users:
            print(f"ID: {user[0]}")
            print(f"用户名: {user[1]}")
            print(f"邮箱: {user[2]}")
            print(f"状态: {'激活' if user[3] else '未激活'}")
            print(f"创建时间: {user[4]}")
            print("-" * 30)
    else:
        print("暂无注册用户")
    
    print(f"\n总用户数: {len(users)}")
    conn.close()

if __name__ == "__main__":
    check_users()