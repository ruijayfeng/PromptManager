import React, { useState } from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../../stores/auth'

export function Layout() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                to="/"
                className="flex items-center space-x-2"
              >
                <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PM</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Prompt Manager
                </h1>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <Link 
                  to="/prompts"
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  我的提示词
                </Link>
              </nav>

              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-sm bg-white dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 p-1"
                >
                  <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="hidden md:block text-gray-700 dark:text-gray-300">
                    {user?.username}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        <div className="font-medium">{user?.username}</div>
                        <div className="text-gray-500 dark:text-gray-400">{user?.email}</div>
                      </div>
                      
                      <button
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        设置
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        退出登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* 点击外部关闭下拉菜单 */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  )
}