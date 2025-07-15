import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Search, X, Filter, Tag, Folder } from 'lucide-react'
import { clsx } from 'clsx'
import { debounce } from 'lodash-es'

interface SearchBarProps {
  onSearch: (query: string) => void
  onCategoryFilter?: (categoryId: number | null) => void
  onTagFilter?: (tagIds: number[]) => void
  categories?: Array<{ id: number; name: string; color: string }>
  tags?: Array<{ id: number; name: string; color: string }>
  placeholder?: string
  className?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onCategoryFilter,
  onTagFilter,
  categories = [],
  tags = [],
  placeholder = "搜索提示词...",
  className
}) => {
  const [query, setQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch(searchQuery)
    }, 300),
    [onSearch]
  )

  useEffect(() => {
    debouncedSearch(query)
    return () => {
      debouncedSearch.cancel()
    }
  }, [query, debouncedSearch])

  const handleClearSearch = () => {
    setQuery('')
    onSearch('')
    searchInputRef.current?.focus()
  }

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
    onCategoryFilter?.(categoryId)
  }

  const handleTagToggle = (tagId: number) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId]
    
    setSelectedTags(newSelectedTags)
    onTagFilter?.(newSelectedTags)
  }

  const clearAllFilters = () => {
    setSelectedCategory(null)
    setSelectedTags([])
    onCategoryFilter?.(null)
    onTagFilter?.([])
  }

  const hasActiveFilters = selectedCategory !== null || selectedTags.length > 0

  return (
    <div className={clsx('relative', className)}>
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={clsx(
            'block w-full pl-10 pr-20 py-3 border border-gray-300 dark:border-gray-600',
            'rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            'placeholder-gray-500 dark:placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
            'transition-colors duration-200'
          )}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
          {query && (
            <button
              onClick={handleClearSearch}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="清除搜索"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
              'hover:bg-gray-100 dark:hover:bg-gray-700',
              hasActiveFilters && 'text-orange-600 dark:text-orange-400'
            )}
            aria-label="筛选选项"
            aria-expanded={isFilterOpen}
          >
            <Filter className="h-4 w-4" />
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* 筛选面板 */}
      {isFilterOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                筛选条件
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-orange-600 dark:text-orange-400 hover:underline"
                >
                  清除所有
                </button>
              )}
            </div>

            {/* 分类筛选 */}
            {categories.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Folder className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    分类
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={clsx(
                      'px-3 py-1 text-xs rounded-full transition-colors',
                      selectedCategory === null
                        ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    )}
                  >
                    全部
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={clsx(
                        'px-3 py-1 text-xs rounded-full transition-colors',
                        selectedCategory === category.id
                          ? 'text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:opacity-80'
                      )}
                      style={{
                        backgroundColor: selectedCategory === category.id 
                          ? category.color 
                          : selectedCategory === null
                            ? 'rgb(243 244 246)' 
                            : 'rgb(156 163 175)'
                      }}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 标签筛选 */}
            {tags.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    标签
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id)
                    return (
                      <button
                        key={tag.id}
                        onClick={() => handleTagToggle(tag.id)}
                        className={clsx(
                          'px-3 py-1 text-xs rounded-full transition-colors border',
                          isSelected
                            ? 'text-white border-transparent'
                            : 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        )}
                        style={{
                          backgroundColor: isSelected ? tag.color : 'transparent'
                        }}
                      >
                        {tag.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}