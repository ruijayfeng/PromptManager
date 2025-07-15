from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, joinedload
import json
import io
from typing import List, Optional

from ..database import get_db
from ..models.prompt import Prompt, Category, Tag
from ..models.user import User
from ..utils.auth import get_current_active_user

router = APIRouter()

@router.get("/prompts")
async def export_prompts(
    format: str = "json",
    prompt_ids: Optional[List[int]] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """导出Prompt"""
    query = db.query(Prompt).options(
        joinedload(Prompt.category),
        joinedload(Prompt.tags)
    ).filter(Prompt.user_id == current_user.id)
    
    if prompt_ids:
        query = query.filter(Prompt.id.in_(prompt_ids))
    
    prompts = query.all()
    
    if format == "json":
        return export_json(prompts)
    elif format == "markdown":
        return export_markdown(prompts)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="不支持的导出格式"
        )

def export_json(prompts: List[Prompt]):
    """导出为JSON格式"""
    export_data = {
        "export_info": {
            "version": "1.0",
            "exported_at": "2024-01-01T00:00:00Z",
            "total_prompts": len(prompts)
        },
        "prompts": []
    }
    
    for prompt in prompts:
        prompt_data = {
            "id": prompt.id,
            "title": prompt.title,
            "content": prompt.content,
            "description": prompt.description,
            "is_public": prompt.is_public,
            "is_favorite": prompt.is_favorite,
            "view_count": prompt.view_count,
            "created_at": prompt.created_at.isoformat(),
            "updated_at": prompt.updated_at.isoformat(),
            "category": {
                "name": prompt.category.name,
                "color": prompt.category.color
            } if prompt.category else None,
            "tags": [
                {
                    "name": tag.name,
                    "color": tag.color
                } for tag in prompt.tags
            ]
        }
        export_data["prompts"].append(prompt_data)
    
    json_str = json.dumps(export_data, ensure_ascii=False, indent=2)
    json_bytes = io.BytesIO(json_str.encode('utf-8'))
    
    return StreamingResponse(
        io.BytesIO(json_bytes.getvalue()),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=prompts_export.json"}
    )

def export_markdown(prompts: List[Prompt]):
    """导出为Markdown格式"""
    markdown_content = "# 我的Prompt集合\n\n"
    markdown_content += f"导出时间: {prompts[0].created_at.strftime('%Y-%m-%d %H:%M:%S') if prompts else ''}\n\n"
    markdown_content += f"总数: {len(prompts)} 个提示词\n\n"
    markdown_content += "---\n\n"
    
    for i, prompt in enumerate(prompts, 1):
        markdown_content += f"## {i}. {prompt.title}\n\n"
        
        # 元信息
        metadata = []
        if prompt.category:
            metadata.append(f"分类: {prompt.category.name}")
        if prompt.tags:
            tag_names = [tag.name for tag in prompt.tags]
            metadata.append(f"标签: {', '.join(tag_names)}")
        if prompt.is_favorite:
            metadata.append("⭐ 收藏")
        if prompt.is_public:
            metadata.append("🌐 公开")
        
        if metadata:
            markdown_content += f"**元信息**: {' | '.join(metadata)}\n\n"
        
        if prompt.description:
            markdown_content += f"**描述**: {prompt.description}\n\n"
        
        markdown_content += f"**内容**:\n```\n{prompt.content}\n```\n\n"
        markdown_content += f"**统计**: 查看 {prompt.view_count} 次 | 创建于 {prompt.created_at.strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        markdown_content += "---\n\n"
    
    markdown_bytes = io.BytesIO(markdown_content.encode('utf-8'))
    
    return StreamingResponse(
        io.BytesIO(markdown_bytes.getvalue()),
        media_type="text/markdown",
        headers={"Content-Disposition": "attachment; filename=prompts_export.md"}
    )

@router.post("/import")
async def import_prompts(
    file: UploadFile = File(...),
    format: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """导入Prompt"""
    if format not in ["json", "markdown"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="不支持的导入格式"
        )
    
    try:
        content = await file.read()
        content_str = content.decode('utf-8')
        
        if format == "json":
            imported_count = await import_from_json(content_str, db, current_user)
        else:
            imported_count = await import_from_markdown(content_str, db, current_user)
        
        return {
            "message": f"成功导入 {imported_count} 个提示词",
            "imported_count": imported_count
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"导入失败: {str(e)}"
        )

async def import_from_json(content: str, db: Session, user: User) -> int:
    """从JSON导入"""
    try:
        data = json.loads(content)
        prompts_data = data.get("prompts", []) if isinstance(data, dict) else data
        
        imported_count = 0
        for prompt_data in prompts_data:
            # 检查必要字段
            if not prompt_data.get("title") or not prompt_data.get("content"):
                continue
            
            # 处理分类
            category_id = None
            if prompt_data.get("category"):
                category_name = prompt_data["category"].get("name")
                category_color = prompt_data["category"].get("color", "#e07a47")
                if category_name:
                    category = db.query(Category).filter(
                        Category.name == category_name,
                        Category.user_id == user.id
                    ).first()
                    if not category:
                        category = Category(
                            name=category_name,
                            color=category_color,
                            user_id=user.id
                        )
                        db.add(category)
                        db.flush()
                    category_id = category.id
            
            # 创建提示词
            prompt = Prompt(
                title=prompt_data["title"],
                content=prompt_data["content"],
                description=prompt_data.get("description"),
                is_public=prompt_data.get("is_public", False),
                is_favorite=prompt_data.get("is_favorite", False),
                category_id=category_id,
                user_id=user.id
            )
            db.add(prompt)
            db.flush()
            
            # 处理标签
            if prompt_data.get("tags"):
                for tag_data in prompt_data["tags"]:
                    tag_name = tag_data.get("name")
                    tag_color = tag_data.get("color", "#0066cc")
                    if tag_name:
                        tag = db.query(Tag).filter(Tag.name == tag_name).first()
                        if not tag:
                            tag = Tag(name=tag_name, color=tag_color)
                            db.add(tag)
                            db.flush()
                        prompt.tags.append(tag)
            
            imported_count += 1
        
        db.commit()
        return imported_count
        
    except json.JSONDecodeError:
        raise ValueError("无效的JSON格式")

async def import_from_markdown(content: str, db: Session, user: User) -> int:
    """从Markdown导入"""
    lines = content.split('\n')
    prompts = []
    current_prompt = None
    content_lines = []
    in_content_block = False
    
    for line in lines:
        line = line.strip()
        
        # 检测标题
        if line.startswith('## ') and not line.startswith('### '):
            # 保存上一个提示词
            if current_prompt and content_lines:
                current_prompt['content'] = '\n'.join(content_lines).strip()
                prompts.append(current_prompt)
            
            # 开始新的提示词
            title = line[3:].strip()
            # 移除编号（如果有）
            if '. ' in title:
                title = title.split('. ', 1)[1]
            
            current_prompt = {'title': title}
            content_lines = []
            in_content_block = False
            
        elif current_prompt:
            # 检测描述
            if line.startswith('**描述**:'):
                current_prompt['description'] = line[6:].strip()
            
            # 检测内容块
            elif line.startswith('**内容**:'):
                in_content_block = True
                content_lines = []
            elif line == '```' and in_content_block:
                in_content_block = False
            elif in_content_block and line != '```':
                content_lines.append(line)
    
    # 保存最后一个提示词
    if current_prompt and content_lines:
        current_prompt['content'] = '\n'.join(content_lines).strip()
        prompts.append(current_prompt)
    
    # 导入到数据库
    imported_count = 0
    for prompt_data in prompts:
        if prompt_data.get('title') and prompt_data.get('content'):
            prompt = Prompt(
                title=prompt_data['title'],
                content=prompt_data['content'],
                description=prompt_data.get('description'),
                user_id=user.id
            )
            db.add(prompt)
            imported_count += 1
    
    db.commit()
    return imported_count