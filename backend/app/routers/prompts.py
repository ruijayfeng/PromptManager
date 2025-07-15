from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import List, Optional

from ..database import get_db
from ..schemas.prompt import Prompt as PromptSchema, PromptCreate, PromptUpdate, PromptList
from ..models.prompt import Prompt, Tag
from ..models.user import User
from ..utils.auth import get_current_active_user

router = APIRouter()

@router.post("/", response_model=PromptSchema)
async def create_prompt(
    prompt: PromptCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """创建新的Prompt"""
    db_prompt = Prompt(
        **prompt.dict(exclude={"tag_ids"}),
        user_id=current_user.id
    )
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)
    
    # 处理标签关联
    if prompt.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(prompt.tag_ids)).all()
        db_prompt.tags = tags
        db.commit()
    
    return db_prompt

@router.get("/", response_model=PromptList)
async def list_prompts(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category_id: Optional[int] = None,
    is_public: Optional[bool] = None,
    is_favorite: Optional[bool] = None,
    search: Optional[str] = None,
    sort_by: str = Query("created_at", regex="^(created_at|updated_at|view_count|title)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取Prompt列表"""
    # 使用更高效的查询策略
    query = db.query(Prompt).filter(Prompt.user_id == current_user.id)
    
    # 应用过滤器
    if category_id is not None:
        query = query.filter(Prompt.category_id == category_id)
    if is_public is not None:
        query = query.filter(Prompt.is_public == is_public)
    if is_favorite is not None:
        query = query.filter(Prompt.is_favorite == is_favorite)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Prompt.title.ilike(search_term),
                Prompt.content.ilike(search_term),
                Prompt.description.ilike(search_term)
            )
        )
    
    # 动态排序
    sort_column = getattr(Prompt, sort_by)
    if sort_order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())
    
    # 计算总数（在分页之前）
    total = query.count()
    
    # 分页并预加载关联数据
    offset = (page - 1) * per_page
    prompts = query.offset(offset).limit(per_page).options(
        joinedload(Prompt.category),
        joinedload(Prompt.tags)
    ).all()
    
    return PromptList(
        prompts=prompts,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page
    )

@router.get("/{prompt_id}", response_model=PromptSchema)
async def get_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取单个Prompt"""
    prompt = db.query(Prompt).options(
        joinedload(Prompt.category),
        joinedload(Prompt.tags)
    ).filter(
        Prompt.id == prompt_id,
        Prompt.user_id == current_user.id
    ).first()
    
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt不存在"
        )
    
    # 增加查看次数
    prompt.view_count += 1
    db.commit()
    
    return prompt

@router.put("/{prompt_id}", response_model=PromptSchema)
async def update_prompt(
    prompt_id: int,
    prompt_update: PromptUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """更新Prompt"""
    prompt = db.query(Prompt).filter(
        Prompt.id == prompt_id,
        Prompt.user_id == current_user.id
    ).first()
    
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt不存在"
        )
    
    # 更新字段
    update_data = prompt_update.dict(exclude_unset=True, exclude={"tag_ids"})
    for field, value in update_data.items():
        setattr(prompt, field, value)
    
    # 处理标签更新
    if prompt_update.tag_ids is not None:
        if prompt_update.tag_ids:
            tags = db.query(Tag).filter(Tag.id.in_(prompt_update.tag_ids)).all()
            prompt.tags = tags
        else:
            prompt.tags = []
    
    db.commit()
    db.refresh(prompt)
    
    return prompt

@router.post("/{prompt_id}/favorite")
async def toggle_favorite(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """切换收藏状态"""
    prompt = db.query(Prompt).filter(
        Prompt.id == prompt_id,
        Prompt.user_id == current_user.id
    ).first()
    
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt不存在"
        )
    
    prompt.is_favorite = not prompt.is_favorite
    db.commit()
    
    return {
        "message": "收藏状态已更新",
        "is_favorite": prompt.is_favorite
    }

@router.post("/{prompt_id}/public")
async def toggle_public(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """切换公开状态"""
    prompt = db.query(Prompt).filter(
        Prompt.id == prompt_id,
        Prompt.user_id == current_user.id
    ).first()
    
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt不存在"
        )
    
    prompt.is_public = not prompt.is_public
    db.commit()
    
    return {
        "message": "公开状态已更新",
        "is_public": prompt.is_public
    }

@router.get("/public", response_model=PromptList)
async def list_public_prompts(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    sort_by: str = Query("view_count", regex="^(created_at|updated_at|view_count|title)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    """获取公开的Prompt列表"""
    # 使用索引优化的查询
    query = db.query(Prompt).filter(Prompt.is_public == True)
    
    # 应用过滤器
    if category_id is not None:
        query = query.filter(Prompt.category_id == category_id)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Prompt.title.ilike(search_term),
                Prompt.content.ilike(search_term),
                Prompt.description.ilike(search_term)
            )
        )
    
    # 动态排序
    sort_column = getattr(Prompt, sort_by)
    if sort_order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())
    
    # 计算总数
    total = query.count()
    
    # 分页并预加载关联数据
    offset = (page - 1) * per_page
    prompts = query.offset(offset).limit(per_page).options(
        joinedload(Prompt.category),
        joinedload(Prompt.tags),
        joinedload(Prompt.owner)
    ).all()
    
    return PromptList(
        prompts=prompts,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=(total + per_page - 1) // per_page
    )

@router.delete("/{prompt_id}")
async def delete_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """删除Prompt"""
    prompt = db.query(Prompt).filter(
        Prompt.id == prompt_id,
        Prompt.user_id == current_user.id
    ).first()
    
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt不存在"
        )
    
    db.delete(prompt)
    db.commit()
    
    return {"message": "Prompt已删除"}