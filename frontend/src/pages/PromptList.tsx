import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Filter, Grid, List, SortAsc, SortDesc } from 'lucide-react'
import { usePromptStore } from '../stores/prompt'
import { PromptCard } from '../components/prompt/PromptCard'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Alert } from '../components/ui/Alert'

export function PromptList() {
  const navigate = useNavigate()
  const {
    prompts,
    categories,
    isLoading,
    error,
    pagination,
    filters,
    fetchPrompts,
    fetchCategories,
    setFilters,
    clearError
  } = usePromptStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'created_at' | 'title' | 'view_count'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchPrompts()
    fetchCategories()
  }, [fetchPrompts, fetchCategories])

  useEffect(() => {
    // 延迟搜索
    const debounceTimer = setTimeout(() => {
      if (searchQuery !== (filters.search || '')) {
        setFilters({ search: searchQuery || undefined })
        fetchPrompts()
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, filters.search, setFilters, fetchPrompts])

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ [key]: value })
    fetchPrompts()
  }

  const handlePageChange = (page: number) => {
    fetchPrompts({ page })
  }

  const handleCreateNew = () => {
    navigate('/prompts/create')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            我的提示词
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            管理和组织您的AI提示词集合
          </p>
        </div>
        
        <Button onClick={handleCreateNew} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>创建提示词</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="搜索提示词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search />}
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>筛选</span>
          </Button>
          
          <div className="flex items-center space-x-1 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  分类
                </label>
                <select
                  value={filters.category_id || ''}
                  onChange={(e) => handleFilterChange('category_id', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">所有分类</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  状态
                </label>
                <select
                  value={filters.is_public === undefined ? '' : filters.is_public ? 'public' : 'private'}
                  onChange={(e) => handleFilterChange('is_public', e.target.value === '' ? undefined : e.target.value === 'public')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">全部</option>
                  <option value="public">公开</option>
                  <option value="private">私有</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  收藏
                </label>
                <select
                  value={filters.is_favorite === undefined ? '' : filters.is_favorite ? 'favorite' : 'normal'}
                  onChange={(e) => handleFilterChange('is_favorite', e.target.value === '' ? undefined : e.target.value === 'favorite')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">全部</option>
                  <option value="favorite">已收藏</option>
                  <option value="normal">未收藏</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  排序
                </label>
                <div className="flex space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="created_at">创建时间</option>
                    <option value="title">标题</option>
                    <option value="view_count">查看次数</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">加载中...</span>
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Plus className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            还没有提示词
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            创建您的第一个提示词来开始使用
          </p>
          <Button onClick={handleCreateNew} className="flex items-center space-x-2 mx-auto">
            <Plus className="h-4 w-4" />
            <span>创建提示词</span>
          </Button>
        </div>
      ) : (
        <>
          {/* Prompt Grid */}
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {prompts.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                上一页
              </Button>
              
              <span className="text-sm text-gray-600 dark:text-gray-400">
                第 {pagination.page} 页，共 {pagination.total_pages} 页
              </span>
              
              <Button
                variant="outline"
                disabled={pagination.page === pagination.total_pages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                下一页
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}