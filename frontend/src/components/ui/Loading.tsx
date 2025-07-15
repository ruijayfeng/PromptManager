import React from 'react'
import { clsx } from 'clsx'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  type?: 'spinner' | 'dots' | 'pulse'
  className?: string
  text?: string
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  type = 'spinner',
  className,
  text
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const renderSpinner = () => (
    <div className={clsx(
      'animate-spin rounded-full border-2 border-gray-300 border-t-orange-500',
      sizes[size],
      className
    )} />
  )

  const renderDots = () => (
    <div className={clsx('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={clsx(
            'bg-orange-500 rounded-full animate-bounce',
            size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4'
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  )

  const renderPulse = () => (
    <div className={clsx(
      'bg-orange-500 rounded-full animate-pulse',
      sizes[size],
      className
    )} />
  )

  const renderLoading = () => {
    switch (type) {
      case 'dots':
        return renderDots()
      case 'pulse':
        return renderPulse()
      default:
        return renderSpinner()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {renderLoading()}
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

// 页面加载组件
export const PageLoading: React.FC<{ text?: string }> = ({ text = '加载中...' }) => (
  <div className="flex items-center justify-center min-h-screen">
    <Loading size="lg" text={text} />
  </div>
)

// 内容加载组件
export const ContentLoading: React.FC<{ text?: string }> = ({ text = '加载中...' }) => (
  <div className="flex items-center justify-center py-12">
    <Loading size="md" text={text} />
  </div>
)