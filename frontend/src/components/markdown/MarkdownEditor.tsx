import React, { useState, useRef, useEffect } from 'react'
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Link, 
  Image, 
  List, 
  ListOrdered, 
  Quote, 
  Table,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  HelpCircle
} from 'lucide-react'
import { clsx } from 'clsx'
import { MarkdownRenderer } from './MarkdownRenderer'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  label?: string
  className?: string
  height?: string
  showToolbar?: boolean
  showPreview?: boolean
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = '开始编写您的Markdown内容...',
  error,
  label,
  className,
  height = '400px',
  showToolbar = true,
  showPreview = true
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSplitView, setIsSplitView] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 插入文本的通用函数
  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const textToInsert = selectedText || placeholder

    const newValue = value.substring(0, start) + before + textToInsert + after + value.substring(end)
    onChange(newValue)

    // 重新设置光标位置
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + textToInsert.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 10)
  }

  // 插入列表的函数
  const insertList = (ordered: boolean = false) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    const lines = selectedText.split('\n')
    const listItems = lines.map((line, index) => {
      const prefix = ordered ? `${index + 1}. ` : '- '
      return line.trim() ? prefix + line.trim() : prefix + '列表项'
    }).join('\n')

    const newValue = value.substring(0, start) + listItems + value.substring(end)
    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
    }, 10)
  }

  // 插入表格
  const insertTable = () => {
    const tableMarkdown = `| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 行1 | 数据 | 数据 |
| 行2 | 数据 | 数据 |`
    
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const newValue = value.substring(0, start) + '\n' + tableMarkdown + '\n' + value.substring(start)
    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
    }, 10)
  }

  // 处理键盘快捷键
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          insertText('**', '**', '粗体文本')
          break
        case 'i':
          e.preventDefault()
          insertText('*', '*', '斜体文本')
          break
        case 'k':
          e.preventDefault()
          insertText('[', '](url)', '链接文本')
          break
        default:
          break
      }
    }

    // Tab键处理
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      // 插入Tab字符
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)

      // 设置光标位置
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2)
      }, 10)
    }
  }

  const toolbarButtons = [
    {
      icon: Bold,
      title: '粗体 (Ctrl+B)',
      action: () => insertText('**', '**', '粗体文本')
    },
    {
      icon: Italic,
      title: '斜体 (Ctrl+I)',
      action: () => insertText('*', '*', '斜体文本')
    },
    {
      icon: Strikethrough,
      title: '删除线',
      action: () => insertText('~~', '~~', '删除线文本')
    },
    {
      icon: Code,
      title: '行内代码',
      action: () => insertText('`', '`', '代码')
    },
    {
      icon: Link,
      title: '链接 (Ctrl+K)',
      action: () => insertText('[', '](url)', '链接文本')
    },
    {
      icon: Image,
      title: '图片',
      action: () => insertText('![', '](image-url)', '图片描述')
    },
    {
      icon: List,
      title: '无序列表',
      action: () => insertList(false)
    },
    {
      icon: ListOrdered,
      title: '有序列表',
      action: () => insertList(true)
    },
    {
      icon: Quote,
      title: '引用',
      action: () => insertText('> ', '', '引用内容')
    },
    {
      icon: Table,
      title: '表格',
      action: insertTable
    }
  ]

  return (
    <div className={clsx(
      'border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden',
      isFullscreen && 'fixed inset-0 z-50 bg-white dark:bg-gray-900',
      className
    )}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 py-2">
          <div className="flex items-center space-x-1">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                onClick={button.action}
                title={button.title}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <button.icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1">
            {showPreview && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsPreviewMode(!isPreviewMode)
                    setIsSplitView(false)
                  }}
                  title={isPreviewMode ? '编辑模式' : '预览模式'}
                  className={clsx(
                    'p-2 rounded transition-colors',
                    isPreviewMode
                      ? 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setIsSplitView(!isSplitView)
                    setIsPreviewMode(false)
                  }}
                  title="分屏模式"
                  className={clsx(
                    'p-2 rounded transition-colors',
                    isSplitView
                      ? 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <div className="h-4 w-4 border border-current flex">
                    <div className="flex-1 border-r border-current"></div>
                    <div className="flex-1"></div>
                  </div>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              title="Markdown帮助"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? '退出全屏' : '全屏模式'}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Help Panel */}
      {showHelp && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 p-4 text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">格式化</h4>
              <div className="space-y-1 text-blue-700 dark:text-blue-300">
                <div>**粗体**</div>
                <div>*斜体*</div>
                <div>~~删除线~~</div>
                <div>`代码`</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">链接</h4>
              <div className="space-y-1 text-blue-700 dark:text-blue-300">
                <div>[链接](url)</div>
                <div>![图片](url)</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">列表</h4>
              <div className="space-y-1 text-blue-700 dark:text-blue-300">
                <div>- 无序列表</div>
                <div>1. 有序列表</div>
                <div>- [ ] 任务列表</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">其他</h4>
              <div className="space-y-1 text-blue-700 dark:text-blue-300">
                <div># 标题</div>
                <div>> 引用</div>
                <div>```代码块```</div>
                <div>$数学公式$</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor/Preview Area */}
      <div className={clsx(
        'flex',
        isSplitView ? 'divide-x divide-gray-200 dark:divide-gray-700' : ''
      )} style={{ height: isFullscreen ? 'calc(100vh - 120px)' : height }}>
        {/* Editor */}
        {(!isPreviewMode || isSplitView) && (
          <div className={clsx('flex-1', isSplitView ? 'w-1/2' : 'w-full')}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={clsx(
                'w-full h-full p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100',
                'border-0 outline-none resize-none font-mono text-sm leading-relaxed',
                'placeholder-gray-400 dark:placeholder-gray-500'
              )}
            />
          </div>
        )}

        {/* Preview */}
        {(isPreviewMode || isSplitView) && (
          <div className={clsx(
            'flex-1 overflow-y-auto bg-white dark:bg-gray-900',
            isSplitView ? 'w-1/2' : 'w-full'
          )}>
            <div className="p-4">
              {value ? (
                <MarkdownRenderer content={value} />
              ) : (
                <div className="text-gray-400 dark:text-gray-500 text-center py-8">
                  预览将在这里显示...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      )}
    </div>
  )
}