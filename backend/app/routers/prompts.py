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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取Prompt列表"""
    query = db.query(Prompt).options(
        joinedload(Prompt.category),
        joinedload(Prompt.tags)
    ).filter(Prompt.user_id == current_user.id)
    
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
    
    # 按创建时间倒序排列
    query = query.order_by(Prompt.created_at.desc())
    
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