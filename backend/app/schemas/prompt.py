from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Tag schemas
class TagBase(BaseModel):
    name: str
    color: Optional[str] = "#0066cc"

class TagCreate(TagBase):
    pass

class TagUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None

class Tag(TagBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Category schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    color: Optional[str] = "#e07a47"

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None

class Category(CategoryBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Prompt schemas
class PromptBase(BaseModel):
    title: str
    content: str
    description: Optional[str] = None
    is_public: Optional[bool] = False
    is_favorite: Optional[bool] = False

class PromptCreate(PromptBase):
    category_id: Optional[int] = None
    tag_ids: Optional[List[int]] = []

class PromptUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None
    is_favorite: Optional[bool] = None
    category_id: Optional[int] = None
    tag_ids: Optional[List[int]] = None

class Prompt(PromptBase):
    id: int
    user_id: int
    category_id: Optional[int] = None
    view_count: int
    created_at: datetime
    updated_at: datetime
    category: Optional[Category] = None
    tags: List[Tag] = []

    class Config:
        from_attributes = True

class PromptList(BaseModel):
    prompts: List[Prompt]
    total: int
    page: int
    per_page: int
    total_pages: int