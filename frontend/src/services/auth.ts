import { AxiosError } from 'axios'
import { apiService } from './api'
import { AuthToken, AuthUser, LoginForm, RegisterForm } from '../types'

export class AuthService {
  // 处理API错误的辅助方法
  private static handleError(error: any): string {
    console.log('Auth Error:', error)
    
    if (error instanceof AxiosError) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        return '无法连接到服务器，请检查网络连接'
      }
      
      if (error.code === 'ECONNABORTED') {
        return '请求超时，请稍后重试'
      }
      
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

  // 用户登录
  static async login(credentials: LoginForm): Promise<AuthToken> {
    try {
      const response = await apiService.post<AuthToken>('/api/auth/login', {
        username: credentials.username,
        password: credentials.password
      })
      return response
    } catch (error: any) {
      throw new Error(this.handleError(error))
    }
  }

  // 用户注册
  static async register(userData: RegisterForm): Promise<AuthUser> {
    try {
      const { confirmPassword, ...registerData } = userData
      const response = await apiService.post<AuthUser>('/api/auth/register', registerData)
      return response
    } catch (error: any) {
      throw new Error(this.handleError(error))
    }
  }

  // 获取当前用户信息
  static async getCurrentUser(): Promise<AuthUser> {
    try {
      const response = await apiService.get<AuthUser>('/api/auth/me')
      return response
    } catch (error: any) {
      throw new Error(this.handleError(error))
    }
  }

  // 检查用户名是否可用
  static async checkUsernameAvailable(username: string): Promise<boolean> {
    try {
      await apiService.get(`/api/auth/check-username/${username}`)
      return true
    } catch (error: any) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        return false
      }
      throw new Error(this.handleError(error))
    }
  }

  // 检查邮箱是否可用
  static async checkEmailAvailable(email: string): Promise<boolean> {
    try {
      await apiService.get(`/api/auth/check-email/${email}`)
      return true
    } catch (error: any) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        return false
      }
      throw new Error(this.handleError(error))
    }
  }

  // 验证JWT令牌
  static async validateToken(): Promise<boolean> {
    try {
      await apiService.get('/api/auth/me')
      return true
    } catch {
      return false
    }
  }
}

export const authService = AuthService