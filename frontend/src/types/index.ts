// 基础类型定义
export interface User {
  id: number
  username: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  description?: string
  color: string
  user_id: number
  created_at: string
}

export interface Tag {
  id: number
  name: string
  color: string
  created_at: string
}

export interface Prompt {
  id: number
  title: string
  content: string
  description?: string
  is_public: boolean
  is_favorite: boolean
  view_count: number
  user_id: number
  category_id?: number
  created_at: string
  updated_at: string
  category?: Category
  tags: Tag[]
}

export interface PromptList {
  prompts: Prompt[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// API 响应类型
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

// 表单类型
export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface PromptForm {
  title: string
  content: string
  description?: string
  is_public: boolean
  is_favorite: boolean
  category_id?: number
  tag_ids: number[]
}