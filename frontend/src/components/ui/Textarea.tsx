import React from 'react'
import { clsx } from 'clsx'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      
      <textarea
        id={textareaId}
        className={clsx(
          'block w-full px-3 py-2.5 border rounded-lg text-sm transition-colors duration-200',
          'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2',
          'resize-vertical min-h-[100px]',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500',
          'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100',
          'dark:placeholder-gray-500 dark:focus:border-orange-500',
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
}