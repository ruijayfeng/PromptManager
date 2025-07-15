import React, { useState } from 'react'
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react'
import { useThemeStore, Theme } from '../../stores/theme'
import { clsx } from 'clsx'

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'md',
  showLabel = false,
  className
}) => {
  const { theme, isDark, setTheme, toggleTheme } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)

  const themes: { value: Theme; label: string; icon: React.ComponentType<any> }[] = [
    { value: 'light', label: '浅色模式', icon: Sun },
    { value: 'dark', label: '深色模式', icon: Moon },
    { value: 'system', label: '跟随系统', icon: Monitor }
  ]

  const currentTheme = themes.find(t => t.value === theme)
  const CurrentIcon = currentTheme?.icon || Sun

  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  if (showLabel) {
    return (
      <div className={clsx('relative', className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={`主题选择器: ${currentTheme?.label}`}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={clsx(
            'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors',
            'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
            'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
            'focus:outline-none focus:ring-2 focus:ring-orange-500'
          )}
        >
          <CurrentIcon className={iconSizes[size]} />
          <span className="text-sm font-medium">{currentTheme?.label}</span>
          <ChevronDown className={clsx(
            'h-4 w-4 transition-transform',
            isOpen && 'transform rotate-180'
          )} />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div 
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20"
              role="menu"
              aria-labelledby="theme-menu-button"
            >
              <div className="py-1">
                {themes.map((themeOption) => {
                  const IconComponent = themeOption.icon
                  return (
                    <button
                      key={themeOption.value}
                      onClick={() => {
                        setTheme(themeOption.value)
                        setIsOpen(false)
                      }}
                      role="menuitem"
                      aria-label={`切换到${themeOption.label}`}
                      className={clsx(
                        'flex items-center w-full px-4 py-2 text-sm transition-colors',
                        'hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700',
                        theme === themeOption.value
                          ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                          : 'text-gray-700 dark:text-gray-300'
                      )}
                    >
                      <IconComponent className="h-4 w-4 mr-3" />
                      {themeOption.label}
                      {theme === themeOption.value && (
                        <div className="ml-auto h-2 w-2 bg-orange-500 rounded-full" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`主题切换: 当前${currentTheme?.label}, 点击切换`}
      title={`当前: ${currentTheme?.label} (点击切换)`}
      className={clsx(
        sizes[size],
        'flex items-center justify-center rounded-lg transition-all duration-200',
        'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
        'hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500',
        className
      )}
    >
      <CurrentIcon className={iconSizes[size]} />
    </button>
  )
}