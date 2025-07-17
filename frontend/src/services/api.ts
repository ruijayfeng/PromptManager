import axios, { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '../stores/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器 - 添加认证头
    this.client.interceptors.request.use(
      (config) => {
        const { token } = useAuthStore.getState()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器 - 处理认证错误
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // 清除本地认证状态
          useAuthStore.getState().logout()
          // 重定向到登录页
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // 通用请求方法
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post(url, data)
    return response.data
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put(url, data)
    return response.data
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete(url)
    return response.data
  }

  // 处理API错误
  static handleApiError(error: AxiosError): string {
    console.log('API Error:', error)
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      return '无法连接到服务器，请检查网络连接或稍后重试'
    }
    
    if (error.code === 'ECONNABORTED') {
      return '请求超时，请稍后重试'
    }
    
    if (error.response?.data) {
      const errorData = error.response.data as any
      if (typeof errorData.detail === 'string') {
        return errorData.detail
      } else if (typeof errorData.detail === 'object') {
        // 处理字段验证错误
        const firstError = Object.values(errorData.detail)[0] as string[]
        return firstError[0] || '请求失败'
      }
    }
    
    return error.message || '网络错误，请稍后重试'
  }
}

export const apiService = new ApiService()

// Categories API
export const categoriesApi = {
  list: () => apiService.get('/api/categories'),
  get: (id: number) => apiService.get(`/api/categories/${id}`),
  create: (data: { name: string; description?: string; color?: string }) => 
    apiService.post('/api/categories', data),
  update: (id: number, data: { name?: string; description?: string; color?: string }) => 
    apiService.put(`/api/categories/${id}`, data),
  delete: (id: number) => apiService.delete(`/api/categories/${id}`)
}

// Tags API
export const tagsApi = {
  list: () => apiService.get('/api/tags'),
  listMy: () => apiService.get('/api/tags/my'),
  get: (id: number) => apiService.get(`/api/tags/${id}`),
  create: (data: { name: string; color?: string }) => 
    apiService.post('/api/tags', data),
  update: (id: number, data: { name?: string; color?: string }) => 
    apiService.put(`/api/tags/${id}`, data),
  delete: (id: number) => apiService.delete(`/api/tags/${id}`)
}

// Prompts API  
export const promptsApi = {
  list: (params?: {
    page?: number
    per_page?: number
    category_id?: number
    is_public?: boolean
    is_favorite?: boolean
    search?: string
  }) => {
    return apiService.get('/api/prompts', params)
  },
  
  listPublic: (params?: {
    page?: number
    per_page?: number
    category_id?: number
    search?: string
  }) => {
    return apiService.get('/api/prompts/public', params)
  },
  
  get: (id: number) => apiService.get(`/api/prompts/${id}`),
  
  create: (data: {
    title: string
    content: string
    description?: string
    category_id?: number
    tag_ids?: number[]
    is_public?: boolean
    is_favorite?: boolean
  }) => apiService.post('/api/prompts', data),
  
  update: (id: number, data: {
    title?: string
    content?: string
    description?: string
    category_id?: number | null
    tag_ids?: number[]
    is_public?: boolean
    is_favorite?: boolean
  }) => apiService.put(`/api/prompts/${id}`, data),
  
  delete: (id: number) => apiService.delete(`/api/prompts/${id}`),
  
  toggleFavorite: (id: number) => apiService.post(`/api/prompts/${id}/favorite`),
  
  togglePublic: (id: number) => apiService.post(`/api/prompts/${id}/public`)
}

// Search API
export const searchApi = {
  searchPrompts: (query: string, filters?: {
    categoryId?: number | null
    tagIds?: number[]
    isPublic?: boolean
    isFavorite?: boolean
    page?: number
    perPage?: number
  }) => {
    const params: any = { search: query }
    
    if (filters?.categoryId !== undefined && filters.categoryId !== null) {
      params.category_id = filters.categoryId
    }
    if (filters?.tagIds?.length) {
      params.tag_ids = filters.tagIds
    }
    if (filters?.isPublic !== undefined) {
      params.is_public = filters.isPublic
    }
    if (filters?.isFavorite !== undefined) {
      params.is_favorite = filters.isFavorite
    }
    if (filters?.page !== undefined) {
      params.page = filters.page
    }
    if (filters?.perPage !== undefined) {
      params.per_page = filters.perPage
    }
    
    return apiService.get('/api/prompts', params)
  }
}

// Export/Import API
export const exportApi = {
  exportPrompts: async (format: 'json' | 'markdown', promptIds?: number[]) => {
    const params: any = { format }
    if (promptIds?.length) {
      params.prompt_ids = promptIds
    }
    
    const response = await apiService.client.get('/api/export/prompts', {
      params,
      responseType: 'blob'
    })
    
    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `prompts_export.${format === 'json' ? 'json' : 'md'}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
  
  importPrompts: async (file: File, format: 'json' | 'markdown') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('format', format)
    
    return apiService.client.post('/api/export/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}