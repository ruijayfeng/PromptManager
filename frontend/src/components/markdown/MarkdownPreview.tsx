import React from 'react'
import { MarkdownRenderer } from './MarkdownRenderer'
import { clsx } from 'clsx'

interface MarkdownPreviewProps {
  content: string
  className?: string
  maxHeight?: string
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  content,
  className,
  maxHeight = '300px'
}) => {
  if (!content.trim()) {
    return (
      <div className={clsx(
        'flex items-center justify-center p-8 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg',
        className
      )}>
        <div className="text-center">
          <p className="text-sm">暂无内容</p>
          <p className="text-xs mt-1">开始编写Markdown内容来查看预览</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={clsx(
        'overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900',
        className
      )}
      style={{ maxHeight }}
    >
      <MarkdownRenderer content={content} />
    </div>
  )
}