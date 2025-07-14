from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import json
import io
from typing import List

from ..database import get_db
from ..models.prompt import Prompt
from ..models.user import User
from ..utils.auth import get_current_active_user

router = APIRouter()

@router.get("/json")
async def export_prompts_json(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """导出Prompt为JSON格式"""
    prompts = db.query(Prompt).filter(Prompt.user_id == current_user.id).all()
    
    # 转换为可序列化的字典
    export_data = []
    for prompt in prompts:
        export_data.append({
            "id": prompt.id,
            "title": prompt.title,
            "content": prompt.content,
            "description": prompt.description,
            "is_public": prompt.is_public,
            "is_favorite": prompt.is_favorite,
            "category_id": prompt.category_id,
            "created_at": prompt.created_at.isoformat(),
            "updated_at": prompt.updated_at.isoformat()
        })
    
    # 创建JSON字符串
    json_str = json.dumps(export_data, ensure_ascii=False, indent=2)
    json_bytes = io.BytesIO(json_str.encode('utf-8'))
    
    return StreamingResponse(
        io.BytesIO(json_bytes.getvalue()),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=prompts.json"}
    )

@router.get("/markdown")
async def export_prompts_markdown(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """导出Prompt为Markdown格式"""
    prompts = db.query(Prompt).filter(Prompt.user_id == current_user.id).all()
    
    # 生成Markdown内容
    markdown_content = "# 我的Prompt集合\n\n"
    
    for prompt in prompts:
        markdown_content += f"## {prompt.title}\n\n"
        if prompt.description:
            markdown_content += f"**描述**: {prompt.description}\n\n"
        markdown_content += f"**内容**:\n```\n{prompt.content}\n```\n\n"
        markdown_content += f"**创建时间**: {prompt.created_at.strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        markdown_content += "---\n\n"
    
    # 创建字节流
    markdown_bytes = io.BytesIO(markdown_content.encode('utf-8'))
    
    return StreamingResponse(
        io.BytesIO(markdown_bytes.getvalue()),
        media_type="text/markdown",
        headers={"Content-Disposition": "attachment; filename=prompts.md"}
    )