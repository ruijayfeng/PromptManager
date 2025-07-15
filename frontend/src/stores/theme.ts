import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  isDark: boolean
  
  // Actions
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  initializeTheme: () => void
}

// 检测系统主题偏好
const getSystemTheme = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// 应用主题到DOM
const applyTheme = (isDark: boolean) => {
  if (typeof window === 'undefined') return
  
  const root = window.document.documentElement
  
  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  
  // 更新meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', isDark ? '#111827' : '#ffffff')
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDark: false,

      setTheme: (theme: Theme) => {
        let isDark: boolean
        
        if (theme === 'system') {
          isDark = getSystemTheme()
        } else {
          isDark = theme === 'dark'
        }
        
        applyTheme(isDark)
        set({ theme, isDark })
      },

      toggleTheme: () => {
        const { theme } = get()
        if (theme === 'system') {
          // 从系统模式切换到对应的明确模式
          const systemIsDark = getSystemTheme()
          get().setTheme(systemIsDark ? 'light' : 'dark')
        } else {
          // 在light和dark之间切换
          get().setTheme(theme === 'light' ? 'dark' : 'light')
        }
      },

      initializeTheme: () => {
        const { theme } = get()
        
        // 监听系统主题变化
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          
          const handleChange = () => {
            if (theme === 'system') {
              const isDark = mediaQuery.matches
              applyTheme(isDark)
              set({ isDark })
            }
          }
          
          mediaQuery.addEventListener('change', handleChange)
          
          // 初始应用主题
          get().setTheme(theme)
          
          // 返回清理函数
          return () => {
            mediaQuery.removeEventListener('change', handleChange)
          }
        }
        
        // 初始应用主题
        get().setTheme(theme)
      }
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        theme: state.theme
      })
    }
  )
)