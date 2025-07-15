import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../stores/auth'
import { LoginForm } from '../types'
import { useForm } from '../hooks/useForm'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Alert } from '../components/ui/Alert'

export function Login() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm
  } = useForm<LoginForm>(
    { username: '', password: '' },
    {
      username: {
        required: true,
        minLength: 3,
        maxLength: 50
      },
      password: {
        required: true,
        minLength: 6
      }
    }
  )

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    clearError()
  }, [clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await login(values)
      navigate('/')
    } catch {
      // 错误已经在store中处理
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-orange-500 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
            登录账户
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            或者{' '}
            <Link 
              to="/register" 
              className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400"
            >
              创建新账户
            </Link>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {error && (
            <Alert
              type="error"
              message={error}
              dismissible
              onDismiss={clearError}
              className="mb-6"
            />
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="用户名"
              type="text"
              value={values.username}
              onChange={(e) => handleChange('username', e.target.value)}
              onBlur={() => handleBlur('username')}
              error={errors.username}
              placeholder="请输入用户名"
              leftIcon={<User />}
              autoComplete="username"
              required
            />

            <Input
              label="密码"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              error={errors.password}
              placeholder="请输入密码"
              leftIcon={<Lock />}
              rightIcon={
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              }
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              登录即表示您同意我们的服务条款和隐私政策
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}