import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Tag, Palette, X } from 'lucide-react'
import { clsx } from 'clsx'
import { tagsApi } from '../../services/api'
import { useToastStore } from '../../stores/toast'
import { Tag as TagType, TagCreateData, TagUpdateData } from '../../types/api'
import { Loading } from '../ui/Loading'

interface TagManagerProps {
  onSelectTags?: (tags: TagType[]) => void
  selectedTags?: TagType[]
  className?: string
  mode?: 'select' | 'manage'
}

const DEFAULT_COLORS = [
  '#0066cc', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
  '#ec4899', '#6366f1', '#14b8a6', '#e07a47'
]

export const TagManager: React.FC<TagManagerProps> = ({
  onSelectTags,
  selectedTags = [],
  className,
  mode = 'manage'
}) => {
  const [tags, setTags] = useState<TagType[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<TagType | null>(null)
  const [formData, setFormData] = useState<TagCreateData>({
    name: '',
    color: DEFAULT_COLORS[0]
  })
  const [submitting, setSubmitting] = useState(false)
  const [newTagInput, setNewTagInput] = useState('')
  const { success, error } = useToastStore()

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      setLoading(true)
      const response = mode === 'select' 
        ? await tagsApi.listMy() 
        : await tagsApi.list()
      setTags(response as TagType[])
    } catch (err) {
      error('加载标签失败')
    } finally {
      setLoading(false)
    }
  }

  const openModal = (tag?: TagType) => {
    if (tag) {
      setEditingTag(tag)
      setFormData({
        name: tag.name,
        color: tag.color
      })
    } else {
      setEditingTag(null)
      setFormData({
        name: '',
        color: DEFAULT_COLORS[0]
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTag(null)
    setFormData({ name: '', color: DEFAULT_COLORS[0] })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      error('标签名称不能为空')
      return
    }

    try {
      setSubmitting(true)
      if (editingTag) {
        await tagsApi.update(editingTag.id, formData as TagUpdateData)
        success('标签更新成功')
      } else {
        await tagsApi.create(formData)
        success('标签创建成功')
      }
      await loadTags()
      closeModal()
    } catch (err) {
      error(editingTag ? '更新标签失败' : '创建标签失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (tag: TagType) => {
    if (!confirm(`确定要删除标签"${tag.name}"吗？`)) {
      return
    }

    try {
      await tagsApi.delete(tag.id)
      success('标签删除成功')
      await loadTags()
      if (selectedTags.some(t => t.id === tag.id)) {
        const newSelectedTags = selectedTags.filter(t => t.id !== tag.id)
        onSelectTags?.(newSelectedTags)
      }
    } catch (err) {
      error('删除标签失败')
    }
  }

  const handleTagSelect = (tag: TagType) => {
    if (mode !== 'select') return

    const isSelected = selectedTags.some(t => t.id === tag.id)
    const newSelectedTags = isSelected
      ? selectedTags.filter(t => t.id !== tag.id)
      : [...selectedTags, tag]
    
    onSelectTags?.(newSelectedTags)
  }

  const handleQuickCreate = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      try {
        const newTag = await tagsApi.create({
          name: newTagInput.trim(),
          color: DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)]
        })
        success('标签创建成功')
        setNewTagInput('')
        await loadTags()
        
        if (mode === 'select') {
          onSelectTags?.([...selectedTags, newTag as TagType])
        }
      } catch (err) {
        error('创建标签失败')
      }
    }
  }

  const removeSelectedTag = (tag: TagType) => {
    const newSelectedTags = selectedTags.filter(t => t.id !== tag.id)
    onSelectTags?.(newSelectedTags)
  }

  if (loading) {
    return <Loading size="md" text="加载标签中..." />
  }

  return (
    <div className={clsx('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <Tag className="h-5 w-5 mr-2 text-blue-500" />
          {mode === 'select' ? '选择标签' : '标签管理'}
        </h3>
        {mode === 'manage' && (
          <button
            onClick={() => openModal()}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            新建标签
          </button>
        )}
      </div>

      {/* 快速创建标签输入框 (仅在选择模式下显示) */}
      {mode === 'select' && (
        <div>
          <input
            type="text"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyPress={handleQuickCreate}
            placeholder="输入标签名称，按回车创建"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* 已选择的标签 (仅在选择模式下显示) */}
      {mode === 'select' && selectedTags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            已选择的标签:
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-white rounded-full"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
                <button
                  onClick={() => removeSelectedTag(tag)}
                  className="ml-2 hover:bg-black/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 标签列表 */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = mode === 'select' && selectedTags.some(t => t.id === tag.id)
          
          return (
            <div
              key={tag.id}
              className={clsx(
                'group relative inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition-all',
                mode === 'select' 
                  ? 'cursor-pointer hover:scale-105'
                  : 'cursor-default',
                isSelected
                  ? 'text-white ring-2 ring-blue-300 dark:ring-blue-600'
                  : 'text-white hover:shadow-md'
              )}
              style={{ 
                backgroundColor: isSelected ? tag.color : tag.color,
                opacity: isSelected ? 1 : 0.9
              }}
              onClick={() => handleTagSelect(tag)}
            >
              <span>{tag.name}</span>
              
              {mode === 'manage' && (
                <div className="absolute -top-1 -right-1 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openModal(tag)
                    }}
                    className="p-1 text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm transition-colors"
                    title="编辑标签"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(tag)
                    }}
                    className="p-1 text-white bg-red-600 hover:bg-red-700 rounded-full shadow-sm transition-colors"
                    title="删除标签"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {tags.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {mode === 'select' ? '暂无可选标签' : '暂无标签'}
          {mode === 'select' && (
            <p className="text-sm mt-1">在上方输入框中输入标签名称并按回车创建新标签</p>
          )}
        </div>
      )}

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
                    {editingTag ? '编辑标签' : '新建标签'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        标签名称 *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="输入标签名称"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        标签颜色
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

                    {/* 预览 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        预览
                      </label>
                      <span
                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-white rounded-full"
                        style={{ backgroundColor: formData.color }}
                      >
                        {formData.name || '标签预览'}
                      </span>
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
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {submitting ? '保存中...' : (editingTag ? '更新' : '创建')}
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