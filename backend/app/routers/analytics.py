from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from typing import Dict, Any

from ..database import get_db
from ..models.prompt import Prompt, Category, Tag
from ..models.user import User
from ..utils.auth import get_current_active_user

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Dict[str, Any]:
    """获取仪表板统计数据"""
    
    # 基础统计
    total_prompts = db.query(Prompt).filter(Prompt.user_id == current_user.id).count()
    public_prompts = db.query(Prompt).filter(
        Prompt.user_id == current_user.id,
        Prompt.is_public == True
    ).count()
    favorite_prompts = db.query(Prompt).filter(
        Prompt.user_id == current_user.id,
        Prompt.is_favorite == True
    ).count()
    total_categories = db.query(Category).filter(Category.user_id == current_user.id).count()
    
    # 总查看次数
    total_views = db.query(func.sum(Prompt.view_count)).filter(
        Prompt.user_id == current_user.id
    ).scalar() or 0
    
    # 最近7天创建的提示词数量
    seven_days_ago = datetime.now() - timedelta(days=7)
    recent_prompts = db.query(Prompt).filter(
        Prompt.user_id == current_user.id,
        Prompt.created_at >= seven_days_ago
    ).count()
    
    # 最受欢迎的提示词（按查看次数）
    popular_prompts = db.query(Prompt).filter(
        Prompt.user_id == current_user.id
    ).order_by(desc(Prompt.view_count)).limit(5).all()
    
    # 分类分布统计
    category_stats = db.query(
        Category.name,
        Category.color,
        func.count(Prompt.id).label('count')
    ).outerjoin(Prompt).filter(
        Category.user_id == current_user.id
    ).group_by(Category.id, Category.name, Category.color).all()
    
    # 最近活动（最近编辑的提示词）
    recent_activity = db.query(Prompt).filter(
        Prompt.user_id == current_user.id
    ).order_by(desc(Prompt.updated_at)).limit(5).all()
    
    return {
        "overview": {
            "total_prompts": total_prompts,
            "public_prompts": public_prompts,
            "favorite_prompts": favorite_prompts,
            "total_categories": total_categories,
            "total_views": total_views,
            "recent_prompts": recent_prompts
        },
        "popular_prompts": [
            {
                "id": prompt.id,
                "title": prompt.title,
                "view_count": prompt.view_count,
                "is_public": prompt.is_public,
                "is_favorite": prompt.is_favorite
            }
            for prompt in popular_prompts
        ],
        "category_distribution": [
            {
                "name": stat.name,
                "color": stat.color,
                "count": stat.count
            }
            for stat in category_stats
        ],
        "recent_activity": [
            {
                "id": prompt.id,
                "title": prompt.title,
                "updated_at": prompt.updated_at.isoformat(),
                "is_public": prompt.is_public,
                "is_favorite": prompt.is_favorite
            }
            for prompt in recent_activity
        ]
    }

@router.get("/trends")
async def get_trends(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Dict[str, Any]:
    """获取趋势数据"""
    
    # 计算日期范围
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)
    
    # 每日创建数据
    daily_creations = []
    current_date = start_date
    while current_date <= end_date:
        count = db.query(Prompt).filter(
            Prompt.user_id == current_user.id,
            func.date(Prompt.created_at) == current_date
        ).count()
        
        daily_creations.append({
            "date": current_date.isoformat(),
            "count": count
        })
        current_date += timedelta(days=1)
    
    # 标签使用统计
    tag_usage = db.query(
        Tag.name,
        Tag.color,
        func.count(Prompt.id).label('usage_count')
    ).join(Prompt.tags).filter(
        Prompt.user_id == current_user.id
    ).group_by(Tag.id, Tag.name, Tag.color).order_by(
        desc(func.count(Prompt.id))
    ).limit(10).all()
    
    return {
        "daily_creations": daily_creations,
        "tag_usage": [
            {
                "name": tag.name,
                "color": tag.color,
                "usage_count": tag.usage_count
            }
            for tag in tag_usage
        ],
        "period": {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "days": days
        }
    }

@router.get("/export-stats")
async def get_export_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Dict[str, Any]:
    """获取导出统计数据"""
    
    # 计算内容长度分布
    prompts = db.query(Prompt).filter(Prompt.user_id == current_user.id).all()
    
    content_length_distribution = {
        "short": 0,      # < 100 字符
        "medium": 0,     # 100-500 字符
        "long": 0,       # 500-1000 字符
        "very_long": 0   # > 1000 字符
    }
    
    total_characters = 0
    for prompt in prompts:
        content_length = len(prompt.content)
        total_characters += content_length
        
        if content_length < 100:
            content_length_distribution["short"] += 1
        elif content_length < 500:
            content_length_distribution["medium"] += 1
        elif content_length < 1000:
            content_length_distribution["long"] += 1
        else:
            content_length_distribution["very_long"] += 1
    
    # 平均内容长度
    avg_content_length = total_characters // len(prompts) if prompts else 0
    
    # 最长和最短的提示词
    if prompts:
        longest_prompt = max(prompts, key=lambda p: len(p.content))
        shortest_prompt = min(prompts, key=lambda p: len(p.content))
    else:
        longest_prompt = shortest_prompt = None
    
    return {
        "content_stats": {
            "total_characters": total_characters,
            "avg_content_length": avg_content_length,
            "length_distribution": content_length_distribution,
            "longest_prompt": {
                "id": longest_prompt.id,
                "title": longest_prompt.title,
                "length": len(longest_prompt.content)
            } if longest_prompt else None,
            "shortest_prompt": {
                "id": shortest_prompt.id,
                "title": shortest_prompt.title,
                "length": len(shortest_prompt.content)
            } if shortest_prompt else None
        },
        "export_recommendations": {
            "best_format": "json" if len(prompts) > 50 else "markdown",
            "estimated_file_size": {
                "json": f"{(total_characters * 1.5) // 1024}KB",
                "markdown": f"{(total_characters * 1.2) // 1024}KB"
            }
        }
    }