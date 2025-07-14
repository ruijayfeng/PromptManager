from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional

from ..database import get_db
from ..schemas.prompt import PromptList
from ..models.prompt import Prompt
from ..models.user import User
from ..utils.auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=PromptList)
async def search_prompts(
    q: str = Query(..., description="搜索关键词"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """搜索Prompt"""
    # 基础查询
    query = db.query(Prompt).filter(Prompt.user_id == current_user.id)
    
    # 搜索条件
    search_filter = or_(
        Prompt.title.contains(q),
        Prompt.content.contains(q),
        Prompt.description.contains(q)
    )
    query = query.filter(search_filter)
    
    # 分类过滤
    if category_id is not None:
        query = query.filter(Prompt.category_id == category_id)
    
    # 计算总数
    total = query.count()
    
    # 分页
    offset = (page - 1) * per_page
    prompts = query.offset(offset).limit(per_page).all()
    
    return PromptList(
        prompts=prompts,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page
    )