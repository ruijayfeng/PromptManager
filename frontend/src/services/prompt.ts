import { AxiosError } from 'axios'
import { apiService } from './api'
import { Prompt, PromptList, PromptForm, Category, Tag } from '../types'

export interface PromptListParams {
  page?: number
  per_page?: number
  category_id?: number
  is_public?: boolean
  is_favorite?: boolean
  search?: string
}

export class PromptService {
  // 处理API错误的辅助方法
  private static handleError(error: any): string {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        const errorData = error.response.data as any
        if (typeof errorData.detail === 'string') {
          return errorData.detail
        } else if (typeof errorData.detail === 'object') {
          const firstError = Object.values(errorData.detail)[0] as string[]
          return firstError[0] || '请求失败'
        }
      }
      return error.message || '网络错误，请稍后重试'
    }
    return error.message || '未知错误'
  }

  // 获取Prompt列表
  static async getPrompts(params: PromptListParams = {}): Promise<PromptList> {
    try {
      const response = await apiService.get<PromptList>('/api/prompts', params)
      return response
    } catch (error: any) {
      throw new Error(this.handleError(error))
    }
  }

  // 获取单个Prompt
  static async getPrompt(id: number): Promise<Prompt> {
    try {
      const response = await apiService.get<Prompt>(`/api/prompts/${id}`)
      return response
    } catch (error: any) {
      throw new Error(this.handleError(error))
    }
  }

  // 创建Prompt
  static async createPrompt(promptData: PromptForm): Promise<Prompt> {
    try {
      const response = await apiService.post<Prompt>('/api/prompts', promptData)
      return response
    } catch (error: any) {
      throw new Error(this.handleError(error))
    }
  }

  // 更新Prompt
  static async updatePrompt(id: number, promptData: Partial<PromptForm>): Promise<Prompt> {
    try {
      const response = await apiService.put<Prompt>(`/api/prompts/${id}`, promptData)
      return response
    } catch (error: any) {
      throw new Error(this.handleError(error))
    }
  }

  // 删除Prompt
  static async deletePrompt(id: number): Promise<void> {
    try {
      await apiService.delete(`/api/prompts/${id}`)
    } catch (error: any) {
      throw new Error(this.handleError(error))
    }
  }

  // 切换收藏状态
  static async toggleFavorite(id: number, isFavorite: boolean): Promise<Prompt> {
    try {
      const response = await apiService.put<Prompt>(`/api/prompts/${id}`, {
        is_favorite: isFavorite
      })
      return response
    } catch (error: any) {
      throw new Error(this.handleError(error))
    }
  }

  // 切换公开状态
  static async togglePublic(id: number, isPublic: boolean): Promise<Prompt> {
    try {
      const response = await apiService.put<Prompt>(`/api/prompts/${id}`, {
        is_public: isPublic
      })
      return response
    } catch (error: any) {
      throw new Error(this.handleError(error))
    }
  }
}

export class CategoryService {
  // 处理API错误的辅助方法
  private static handleError(error: any): string {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        const errorData = error.response.data as any
        if (typeof errorData.detail === 'string') {
          return errorData.detail
        } else if (typeof errorData.detail === 'object') {
          const firstError = Object.values(errorData.detail)[0] as string[]
          return firstError[0] || '请求失败'
        }
      }
      return error.message || '网络错误，请稍后重试'
    }
    return error.message || '未知错误'
  }

  // 获取分类列表
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await apiService.get<Category[]>('/api/categories')
      return response
    } catch (error: any) {
      throw new Error(this.handleError(error))
    }
  }

  // 获取单个分类
  static async getCategory(id: number): Promise<Category> {
    try {
      const response = await apiService.get<Category>(`/api/categories/${id}`)
      return response
    } catch (error: any) {
      throw new Error(this.handleError(error))
    }
  }

  // 创建分类
  static async createCategory(categoryData: {
    name: string
    description?: string
    color?: string
  }): Promise<Category> {
    try {
      const response = await apiService.post<Category>('/api/categories', categoryData)
      return response
    } catch (error: any) {
      throw new Error(this.handleError(error))
    }
  }

  // 更新分类
  static async updateCategory(id: number, categoryData: {
    name?: string
    description?: string
    color?: string
  }): Promise<Category> {
    try {
      const response = await apiService.put<Category>(`/api/categories/${id}`, categoryData)
      return response
    } catch (error: any) {
      throw new Error(this.handleError(error))
    }
  }

  // 删除分类
  static async deleteCategory(id: number): Promise<void> {
    try {
      await apiService.delete(`/api/categories/${id}`)
    } catch (error: any) {
      throw new Error(this.handleError(error))
    }
  }
}

export const promptService = PromptService
export const categoryService = CategoryService