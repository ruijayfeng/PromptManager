import React, { useState } from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { User, LogOut, Settings, ChevronDown, Menu, X } from 'lucide-react'
import { useAuthStore } from '../../stores/auth'
import { ThemeToggle } from '../theme/ThemeToggle'

export function Layout() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link 
                to="/"
                className="flex items-center space-x-2"
              >
                <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PM</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 hidden sm:block">
                  Prompt Manager
                </h1>
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 sm:hidden">
                  PM
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <nav className="flex space-x-8">
                <Link 
                  to="/prompts"
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  我的提示词
                </Link>
              </nav>

              <ThemeToggle size="md" />

              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  aria-label={`用户菜单: ${user?.username}`}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  className="flex items-center space-x-2 text-sm bg-white dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 p-1"
                >
                  <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="hidden lg:block text-gray-700 dark:text-gray-300">
                    {user?.username}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {isDropdownOpen && (
                  <div 
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                    role="menu"
                    aria-labelledby="user-menu-button"
                  >
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        <div className="font-medium">{user?.username}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">{user?.email}</div>
                      </div>
                      
                      <button
                        onClick={() => setIsDropdownOpen(false)}
                        role="menuitem"
                        aria-label="设置"
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        设置
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        role="menuitem"
                        aria-label="退出登录"
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        退出登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle size="sm" />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="打开移动端菜单"
                aria-expanded={isMobileMenuOpen}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
              <nav className="px-2 pt-2 pb-3 space-y-1" role="navigation" aria-label="移动端导航">
                <Link
                  to="/prompts"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  我的提示词
                </Link>
              </nav>
              
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                      {user?.username}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                    }}
                    aria-label="设置"
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    设置
                  </button>
                  
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    aria-label="退出登录"
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Outlet />
      </main>

      {/* 点击外部关闭菜单 */}
      {(isDropdownOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsDropdownOpen(false)
            setIsMobileMenuOpen(false)
          }}
        />
      )}
    </div>
  )
}