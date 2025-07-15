from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas.tag import Tag as TagSchema, TagCreate, TagUpdate
from ..models.prompt import Tag
from ..models.user import User
from ..utils.auth import get_current_active_user

router = APIRouter()

@router.post("/", response_model=TagSchema)
async def create_tag(
    tag: TagCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """创建新的标签"""
    # 检查标签名称是否已存在（全局唯一）
    existing_tag = db.query(Tag).filter(Tag.name == tag.name).first()
    
    if existing_tag:
        return existing_tag  # 如果标签已存在，直接返回
    
    db_tag = Tag(**tag.dict())
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    
    return db_tag

@router.get("/", response_model=List[TagSchema])
async def list_tags(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取所有标签"""
    tags = db.query(Tag).order_by(Tag.name).all()
    return tags

@router.get("/my", response_model=List[TagSchema])
async def list_my_tags(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取用户使用过的标签"""
    # 查询用户的提示词中使用的所有标签
    tags = db.query(Tag).join(Tag.prompts).filter(
        Tag.prompts.any(user_id=current_user.id)
    ).order_by(Tag.name).all()
    
    return tags

@router.get("/{tag_id}", response_model=TagSchema)
async def get_tag(
    tag_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """获取单个标签"""
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    
    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="标签不存在"
        )
    
    return tag

@router.put("/{tag_id}", response_model=TagSchema)
async def update_tag(
    tag_id: int,
    tag_update: TagUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """更新标签"""
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    
    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="标签不存在"
        )
    
    # 检查新的标签名称是否与其他标签冲突
    if tag_update.name and tag_update.name != tag.name:
        existing_tag = db.query(Tag).filter(
            Tag.name == tag_update.name,
            Tag.id != tag_id
        ).first()
        
        if existing_tag:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="标签名称已存在"
            )
    
    # 更新字段
    update_data = tag_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tag, field, value)
    
    db.commit()
    db.refresh(tag)
    
    return tag

@router.delete("/{tag_id}")
async def delete_tag(
    tag_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """删除标签"""
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    
    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="标签不存在"
        )
    
    # 检查是否有关联的提示词
    if tag.prompts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="该标签还在使用中，无法删除"
        )
    
    db.delete(tag)
    db.commit()
    
    return {"message": "标签已删除"}