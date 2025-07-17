import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser, AuthToken, LoginForm, RegisterForm } from '../types'
import { authService } from '../services/auth'

interface AuthState {
  isAuthenticated: boolean
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (credentials: LoginForm) => Promise<void>
  register: (userData: RegisterForm) => Promise<void>
  logout: () => void
  getCurrentUser: () => Promise<void>
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (credentials: LoginForm) => {
        try {
          set({ isLoading: true, error: null })
          
          const tokenData: AuthToken = await authService.login(credentials)
          
          // 先设置token，确保axios拦截器能获取到token
          set({
            token: tokenData.access_token,
            isAuthenticated: true,
          })
          
          // 然后获取用户信息
          const userData: AuthUser = await authService.getCurrentUser()
          
          set({
            isAuthenticated: true,
            token: tokenData.access_token,
            user: userData,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          set({
            isAuthenticated: false,
            token: null,
            user: null,
            isLoading: false,
            error: error.message || '登录失败',
          })
          throw error
        }
      },

      register: async (userData: RegisterForm) => {
        try {
          set({ isLoading: true, error: null })
          
          await authService.register(userData)
          
          // 注册成功后自动登录
          await get().login({
            username: userData.username,
            password: userData.password,
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || '注册失败',
          })
          throw error
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
          error: null,
        })
      },

      getCurrentUser: async () => {
        try {
          if (!get().token) return
          
          set({ isLoading: true })
          const userData = await authService.getCurrentUser()
          
          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false,
            error: error.message || '获取用户信息失败',
          })
        }
      },

      clearError: () => set({ error: null }),
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)