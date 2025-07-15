import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Folder, Palette } from 'lucide-react'
import { clsx } from 'clsx'
import { categoriesApi } from '../../services/api'
import { useToastStore } from '../../stores/toast'
import { Category, CategoryCreateData, CategoryUpdateData } from '../../types/api'
import { Loading } from '../ui/Loading'

interface CategoryManagerProps {
  onSelectCategory?: (category: Category | null) => void
  selectedCategory?: Category | null
  className?: string
}

const DEFAULT_COLORS = [
  '#e07a47', '#0066cc', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16',
  '#f97316', '#ec4899', '#6366f1', '#14b8a6'
]

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  onSelectCategory,
  selectedCategory,
  className
}) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<CategoryCreateData>({
    name: '',
    description: '',
    color: DEFAULT_COLORS[0]
  })
  const [submitting, setSubmitting] = useState(false)
  const { success, error } = useToastStore()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await categoriesApi.list()
      setCategories(response as Category[])
    } catch (err) {
      error('加载分类失败')
    } finally {
      setLoading(false)
    }
  }

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        description: category.description || '',
        color: category.color
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        description: '',
        color: DEFAULT_COLORS[0]
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    setFormData({ name: '', description: '', color: DEFAULT_COLORS[0] })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      error('分类名称不能为空')
      return
    }

    try {
      setSubmitting(true)
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, formData as CategoryUpdateData)
        success('分类更新成功')
      } else {
        await categoriesApi.create(formData)
        success('分类创建成功')
      }
      await loadCategories()
      closeModal()
    } catch (err) {
      error(editingCategory ? '更新分类失败' : '创建分类失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (category: Category) => {
    if (!confirm(`确定要删除分类"${category.name}"吗？`)) {
      return
    }

    try {
      await categoriesApi.delete(category.id)
      success('分类删除成功')
      await loadCategories()
      if (selectedCategory?.id === category.id) {
        onSelectCategory?.(null)
      }
    } catch (err) {
      error('删除分类失败')
    }
  }

  if (loading) {
    return <Loading size="md" text="加载分类中..." />
  }

  return (
    <div className={clsx('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <Folder className="h-5 w-5 mr-2 text-orange-500" />
          分类管理
        </h3>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          新建分类
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 全部分类选项 */}
        <div
          onClick={() => onSelectCategory?.(null)}
          className={clsx(
            'p-4 rounded-lg border-2 cursor-pointer transition-all',
            'hover:border-orange-300 dark:hover:border-orange-600',
            selectedCategory === null
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 bg-gray-400 rounded-full" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  全部
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  显示所有提示词
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 分类列表 */}
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelectCategory?.(category)}
            className={clsx(
              'p-4 rounded-lg border-2 cursor-pointer transition-all group',
              'hover:border-orange-300 dark:hover:border-orange-600',
              selectedCategory?.id === category.id
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div
                  className="h-4 w-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {category.name}
                  </h4>
                  {category.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    openModal(category)
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  title="编辑分类"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(category)
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="删除分类"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 opacity-75" />
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    {editingCategory ? '编辑分类' : '新建分类'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        分类名称 *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="输入分类名称"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        分类描述
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="输入分类描述（可选）"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        分类颜色
                      </label>
                      <div className="flex items-center space-x-2">
                        <Palette className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-wrap gap-2">
                          {DEFAULT_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setFormData({ ...formData, color })}
                              className={clsx(
                                'h-8 w-8 rounded-full border-2 transition-all',
                                formData.color === color
                                  ? 'border-gray-900 dark:border-gray-100 scale-110'
                                  : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !formData.name.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {submitting ? '保存中...' : (editingCategory ? '更新' : '创建')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}