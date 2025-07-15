import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Lock, Mail, Eye, EyeOff, UserPlus } from 'lucide-react'
import { useAuthStore } from '../stores/auth'
import { RegisterForm } from '../types'
import { useForm } from '../hooks/useForm'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Alert } from '../components/ui/Alert'

export function Register() {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm
  } = useForm<RegisterForm>(
    { username: '', email: '', password: '', confirmPassword: '' },
    {
      username: {
        required: true,
        minLength: 3,
        maxLength: 50,
        pattern: /^[a-zA-Z0-9_]+$/,
        custom: (value) => {
          if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return '用户名只能包含字母、数字和下划线'
          }
          return null
        }
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        custom: (value) => {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return '请输入有效的邮箱地址'
          }
          return null
        }
      },
      password: {
        required: true,
        minLength: 6,
        custom: (value) => {
          if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
            return '密码必须包含至少一个字母和一个数字'
          }
          return null
        }
      },
      confirmPassword: {
        required: true,
        custom: (value) => {
          if (value !== values.password) {
            return '两次输入的密码不一致'
          }
          return null
        }
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
      await register(values)
      navigate('/')
    } catch {
      // 错误已经在store中处理
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-orange-500 rounded-full flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
            创建新账户
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            已有账户？{' '}
            <Link 
              to="/login" 
              className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400"
            >
              立即登录
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
              helperText="用户名只能包含字母、数字和下划线"
              autoComplete="username"
              required
            />

            <Input
              label="邮箱地址"
              type="email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={errors.email}
              placeholder="请输入邮箱地址"
              leftIcon={<Mail />}
              autoComplete="email"
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
              helperText="密码至少6位，包含字母和数字"
              autoComplete="new-password"
              required
            />

            <Input
              label="确认密码"
              type={showConfirmPassword ? 'text' : 'password'}
              value={values.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              error={errors.confirmPassword}
              placeholder="请再次输入密码"
              leftIcon={<Lock />}
              rightIcon={
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              }
              autoComplete="new-password"
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
              {isLoading ? '注册中...' : '创建账户'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              注册即表示您同意我们的服务条款和隐私政策
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}