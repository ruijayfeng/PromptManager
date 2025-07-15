import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Eye, Lock, Globe, Calendar, Tag as TagIcon, MoreVertical } from 'lucide-react'
import { Prompt } from '../../types'
import { usePromptStore } from '../../stores/prompt'

interface PromptCardProps {
  prompt: Prompt
  onToggleFavorite?: (id: number) => void
  onTogglePublic?: (id: number) => void
  onDelete?: (id: number) => void
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onToggleFavorite,
  onTogglePublic,
  onDelete
}) => {
  const { toggleFavorite, togglePublic } = usePromptStore()

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await toggleFavorite(prompt.id)
      onToggleFavorite?.(prompt.id)
    } catch (error) {
      console.error('Toggle favorite failed:', error)
    }
  }

  const handleTogglePublic = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await togglePublic(prompt.id)
      onTogglePublic?.(prompt.id)
    } catch (error) {
      console.error('Toggle public failed:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <Link to={`/prompts/${prompt.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200 hover:shadow-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
              {prompt.title}
            </h3>
            {prompt.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {truncateText(prompt.description, 120)}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded-full transition-colors ${
                prompt.is_favorite
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Heart className={`h-4 w-4 ${prompt.is_favorite ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleTogglePublic}
              className={`p-1.5 rounded-full transition-colors ${
                prompt.is_public
                  ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                  : 'text-gray-400 hover:text-green-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {prompt.is_public ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3">
            <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 prose prose-sm prose-gray dark:prose-invert max-w-none">
              {/* 简化的Markdown预览，只显示纯文本 */}
              <p className="font-mono">
                {truncateText(prompt.content.replace(/[#*`_~[\]()]/g, ''), 150)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{prompt.view_count}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(prompt.created_at)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {prompt.category && (
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${prompt.category.color}20`,
                  color: prompt.category.color
                }}
              >
                {prompt.category.name}
              </span>
            )}
            
            {prompt.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <TagIcon className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {prompt.tags.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}