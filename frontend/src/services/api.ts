import axios, { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '../stores/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
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