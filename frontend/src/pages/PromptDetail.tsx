import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Heart, 
  Globe, 
  Lock, 
  Eye, 
  Calendar, 
  Tag as TagIcon, 
  Edit, 
  Copy, 
  Trash2, 
  MoreVertical 
} from 'lucide-react'
import { usePromptStore } from '../stores/prompt'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'

export function PromptDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { 
    currentPrompt, 
    isLoading, 
    error, 
    fetchPrompt, 
    toggleFavorite, 
    togglePublic, 
    deletePrompt,
    clearError 
  } = usePromptStore()

  const [showActions, setShowActions] = useState(false)
  const [copying, setCopying] = useState(false)

  useEffect(() => {
    if (id) {
      fetchPrompt(parseInt(id))
    }
  }, [id, fetchPrompt])

  const handleToggleFavorite = async () => {
    if (!currentPrompt) return
    try {
      await toggleFavorite(currentPrompt.id)
    } catch (error) {
      console.error('Toggle favorite failed:', error)
    }
  }

  const handleTogglePublic = async () => {
    if (!currentPrompt) return
    try {
      await togglePublic(currentPrompt.id)
    } catch (error) {
      console.error('Toggle public failed:', error)
    }
  }

  const handleCopy = async () => {
    if (!currentPrompt) return
    
    try {
      setCopying(true)
      await navigator.clipboard.writeText(currentPrompt.content)
      
      // 可以添加成功提示
      setTimeout(() => setCopying(false), 1000)
    } catch (error) {
      console.error('Copy failed:', error)
      setCopying(false)
    }
  }

  const handleDelete = async () => {
    if (!currentPrompt) return
    
    if (window.confirm('确定要删除这个提示词吗？此操作不可撤销。')) {
      try {
        await deletePrompt(currentPrompt.id)
        navigate('/prompts')
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">加载中...</span>
      </div>
    )
  }

  if (!currentPrompt) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          提示词不存在
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          请检查链接是否正确
        </p>
        <Link to="/prompts">
          <Button variant="outline">返回列表</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/prompts')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回列表</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={copying}
            className="flex items-center space-x-2"
          >
            <Copy className="h-4 w-4" />
            <span>{copying ? '已复制' : '复制内容'}</span>
          </Button>
          
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowActions(!showActions)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <div className="py-1">
                  <button
                    onClick={() => navigate(`/prompts/${currentPrompt.id}/edit`)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    编辑
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    删除
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          message={error}
          dismissible
          onDismiss={clearError}
        />
      )}

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {currentPrompt.title}
              </h1>
              {currentPrompt.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {currentPrompt.description}
                </p>
              )}
              
              {/* Metadata */}
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{currentPrompt.view_count} 次查看</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>创建于 {formatDate(currentPrompt.created_at)}</span>
                </div>
                
                {currentPrompt.updated_at !== currentPrompt.created_at && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>更新于 {formatDate(currentPrompt.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-6">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  currentPrompt.is_favorite
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Heart className={`h-5 w-5 ${currentPrompt.is_favorite ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleTogglePublic}
                className={`p-2 rounded-full transition-colors ${
                  currentPrompt.is_public
                    ? 'text-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'text-gray-400 hover:text-green-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {currentPrompt.is_public ? <Globe className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          {/* Tags and Category */}
          <div className="flex items-center space-x-4 mt-4">
            {currentPrompt.category && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${currentPrompt.category.color}20`,
                  color: currentPrompt.category.color
                }}
              >
                {currentPrompt.category.name}
              </span>
            )}
            
            {currentPrompt.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <TagIcon className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {currentPrompt.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            提示词内容
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
              {currentPrompt.content}
            </pre>
          </div>
        </div>
      </div>

      {/* Click outside to close actions menu */}
      {showActions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  )
}