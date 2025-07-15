from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TagBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50, description="标签名称")
    color: str = Field("#0066cc", regex="^#[0-9a-fA-F]{6}$", description="标签颜色")

class TagCreate(TagBase):
    pass

class TagUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50, description="标签名称")
    color: Optional[str] = Field(None, regex="^#[0-9a-fA-F]{6}$", description="标签颜色")

class Tag(TagBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True