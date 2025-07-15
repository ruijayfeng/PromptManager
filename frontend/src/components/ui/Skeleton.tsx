import React from 'react'
import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: boolean
  circle?: boolean
  lines?: number
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  rounded = true,
  circle = false,
  lines = 1
}) => {
  const baseClass = 'animate-pulse bg-gray-200 dark:bg-gray-700'
  
  if (lines > 1) {
    return (
      <div className={clsx('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              baseClass,
              rounded && 'rounded',
              circle && 'rounded-full'
            )}
            style={{
              width: width || '100%',
              height: height || '1rem'
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={clsx(
        baseClass,
        rounded && 'rounded',
        circle && 'rounded-full',
        className
      )}
      style={{
        width: width || '100%',
        height: height || '1rem'
      }}
    />
  )
}

// 预设的骨架屏组件
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700', className)}>
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <Skeleton height="1.5rem" width="60%" className="mb-2" />
        <Skeleton height="1rem" width="80%" />
      </div>
      <div className="flex space-x-2 ml-4">
        <Skeleton circle width="2rem" height="2rem" />
        <Skeleton circle width="2rem" height="2rem" />
      </div>
    </div>
    
    <div className="mb-4">
      <Skeleton height="4rem" rounded className="mb-2" />
    </div>
    
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Skeleton width="3rem" height="1rem" />
        <Skeleton width="4rem" height="1rem" />
      </div>
      <div className="flex space-x-2">
        <Skeleton width="2rem" height="1.5rem" rounded />
        <Skeleton width="1rem" height="1rem" />
      </div>
    </div>
  </div>
)

export const SkeletonList: React.FC<{ 
  count?: number
  className?: string 
}> = ({ count = 3, className }) => (
  <div className={clsx('space-y-6', className)}>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
)

export const SkeletonProfile: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('flex items-center space-x-3', className)}>
    <Skeleton circle width="3rem" height="3rem" />
    <div className="flex-1">
      <Skeleton height="1.25rem" width="40%" className="mb-2" />
      <Skeleton height="1rem" width="60%" />
    </div>
  </div>
)

export const SkeletonTable: React.FC<{ 
  rows?: number
  columns?: number
  className?: string 
}> = ({ rows = 5, columns = 4, className }) => (
  <div className={clsx('space-y-2', className)}>
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={`header-${index}`} height="2rem" width="80%" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={`cell-${rowIndex}-${colIndex}`} height="1.5rem" width="90%" />
        ))}
      </div>
    ))}
  </div>
)