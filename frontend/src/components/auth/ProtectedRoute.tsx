import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, token, getCurrentUser } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    // 如果有token但用户信息不存在，尝试获取用户信息
    if (token && !useAuthStore.getState().user) {
      getCurrentUser()
    }
  }, [token, getCurrentUser])

  if (!isAuthenticated || !token) {
    // 重定向到登录页面，同时保存当前路径
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute