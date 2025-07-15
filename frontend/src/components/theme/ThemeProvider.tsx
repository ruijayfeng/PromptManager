import React, { useEffect } from 'react'
import { useThemeStore } from '../../stores/theme'

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { initializeTheme } = useThemeStore()

  useEffect(() => {
    const cleanup = initializeTheme()
    return cleanup
  }, [initializeTheme])

  return <>{children}</>
}