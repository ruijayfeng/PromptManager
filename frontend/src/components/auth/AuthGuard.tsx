import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../stores/auth'

interface AuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { token, getCurrentUser, isAuthenticated } = useAuthStore()
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (token && !isAuthenticated) {
          // 如果本地存在token但状态未认证，尝试恢复用户状态
          await getCurrentUser()
        }
      } catch (error) {
        // 如果token无效，清除认证状态
        useAuthStore.getState().logout()
      } finally {
        setIsInitializing(false)
      }
    }

    initializeAuth()
  }, [token, isAuthenticated, getCurrentUser])

  // 在初始化期间显示加载状态
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">正在初始化...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default AuthGuard