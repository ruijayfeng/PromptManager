import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import { clsx } from 'clsx'

// Import highlight.js styles
import 'highlight.js/styles/github.css'
// Import KaTeX styles
import 'katex/dist/katex.min.css'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className
}) => {
  return (
    <div className={clsx(
      'prose prose-gray dark:prose-invert max-w-none',
      'prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100',
      'prose-p:text-gray-700 dark:prose-p:text-gray-300',
      'prose-a:text-orange-600 dark:prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline',
      'prose-strong:text-gray-900 dark:prose-strong:text-gray-100',
      'prose-code:text-orange-600 dark:prose-code:text-orange-400',
      'prose-code:bg-gray-100 dark:prose-code:bg-gray-800',
      'prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
      'prose-pre:bg-gray-50 dark:prose-pre:bg-gray-900',
      'prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700',
      'prose-blockquote:border-orange-500 dark:prose-blockquote:border-orange-400',
      'prose-blockquote:bg-orange-50 dark:prose-blockquote:bg-orange-900/10',
      'prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded',
      'prose-hr:border-gray-300 dark:prose-hr:border-gray-600',
      'prose-table:text-sm',
      'prose-th:bg-gray-50 dark:prose-th:bg-gray-800',
      'prose-td:border-gray-200 dark:prose-td:border-gray-700',
      'prose-th:border-gray-200 dark:prose-th:border-gray-700',
      'prose-li:text-gray-700 dark:prose-li:text-gray-300',
      'prose-img:rounded-lg prose-img:shadow-md',
      className
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          // Custom components for better styling
          h1: ({ children, ...props }) => (
            <h1 className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-1" {...props}>
              {children}
            </h2>
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            
            if (inline) {
              return (
                <code
                  className="bg-gray-100 dark:bg-gray-800 text-orange-600 dark:text-orange-400 px-1 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            
            return (
              <div className="relative">
                {language && (
                  <div className="absolute top-0 right-0 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-bl">
                    {language}
                  </div>
                )}
                <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            )
          },
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-orange-500 dark:border-orange-400 bg-orange-50 dark:bg-orange-900/10 pl-4 py-2 my-4 rounded-r"
              {...props}
            >
              {children}
            </blockquote>
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="border border-gray-200 dark:border-gray-700 px-4 py-2"
              {...props}
            >
              {children}
            </td>
          ),
          // Task list styling
          input: ({ type, checked, ...props }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  {...props}
                />
              )
            }
            return <input type={type} {...props} />
          },
          // Links with external indicator
          a: ({ href, children, ...props }) => {
            const isExternal = href?.startsWith('http')
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="text-orange-600 dark:text-orange-400 hover:underline"
                {...props}
              >
                {children}
                {isExternal && (
                  <span className="inline-block ml-1 text-xs">
                    ↗
                  </span>
                )}
              </a>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}