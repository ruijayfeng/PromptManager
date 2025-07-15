from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="分类名称")
    description: Optional[str] = Field(None, description="分类描述")
    color: str = Field("#e07a47", regex="^#[0-9a-fA-F]{6}$", description="分类颜色")

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="分类名称")
    description: Optional[str] = Field(None, description="分类描述")
    color: Optional[str] = Field(None, regex="^#[0-9a-fA-F]{6}$", description="分类颜色")

class Category(CategoryBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True