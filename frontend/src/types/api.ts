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
  owner?: {
    id: number
    username: string
    email: string
  }
}

export interface PromptList {
  prompts: Prompt[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface User {
  id: number
  username: string
  email: string
  is_active: boolean
  created_at: string
}

export interface ApiResponse<T = any> {
  data: T
  message?: string
}

export interface ApiError {
  detail: string | Record<string, string[]>
}

export interface SearchFilters {
  categoryId?: number | null
  tagIds?: number[]
  isPublic?: boolean
  isFavorite?: boolean
}

export interface PaginationParams {
  page?: number
  perPage?: number
}

export interface PromptCreateData {
  title: string
  content: string
  description?: string
  category_id?: number
  tag_ids?: number[]
  is_public?: boolean
  is_favorite?: boolean
}

export interface PromptUpdateData {
  title?: string
  content?: string
  description?: string
  category_id?: number | null
  tag_ids?: number[]
  is_public?: boolean
  is_favorite?: boolean
}

export interface CategoryCreateData {
  name: string
  description?: string
  color?: string
}

export interface CategoryUpdateData {
  name?: string
  description?: string
  color?: string
}

export interface TagCreateData {
  name: string
  color?: string
}

export interface TagUpdateData {
  name?: string
  color?: string
}