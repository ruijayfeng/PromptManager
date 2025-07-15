import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useForm } from '../../hooks/useForm'
import { usePromptStore } from '../../stores/prompt'
import { PromptForm as PromptFormType } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Alert } from '../ui/Alert'
import { MarkdownEditor } from '../markdown/MarkdownEditor'

interface PromptFormProps {
  initialData?: Partial<PromptFormType>
  isEditing?: boolean
  onSubmit?: (data: PromptFormType) => Promise<void>
  onCancel?: () => void
}

export const PromptForm: React.FC<PromptFormProps> = ({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel
}) => {
  const navigate = useNavigate()
  const { 
    categories, 
    createPrompt, 
    updatePrompt, 
    fetchCategories, 
    isLoading, 
    error, 
    clearError 
  } = usePromptStore()

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    reset
  } = useForm<PromptFormType>(
    {
      title: initialData?.title || '',
      content: initialData?.content || '',
      description: initialData?.description || '',
      is_public: initialData?.is_public || false,
      is_favorite: initialData?.is_favorite || false,
      category_id: initialData?.category_id || undefined,
      tag_ids: initialData?.tag_ids || []
    },
    {
      title: {
        required: true,
        minLength: 1,
        maxLength: 255
      },
      content: {
        required: true,
        minLength: 1
      },
      description: {
        maxLength: 1000
      }
    }
  )

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    clearError()
  }, [clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      if (onSubmit) {
        await onSubmit(values)
      } else if (isEditing && initialData?.id) {
        await updatePrompt(initialData.id, values)
        navigate(`/prompts/${initialData.id}`)
      } else {
        const newPrompt = await createPrompt(values)
        navigate(`/prompts/${newPrompt.id}`)
      }
    } catch (error) {
      console.error('Form submission failed:', error)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate('/prompts')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>取消</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isEditing ? '编辑提示词' : '创建提示词'}
          </h1>
        </div>
        
        <Button
          type="submit"
          form="prompt-form"
          isLoading={isLoading}
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>{isLoading ? '保存中...' : '保存'}</span>
        </Button>
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

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <form id="prompt-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Input
            label="标题"
            type="text"
            value={values.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            error={errors.title}
            placeholder="请输入提示词标题"
            required
          />

          {/* Description */}
          <Textarea
            label="描述（可选）"
            value={values.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            error={errors.description}
            placeholder="简要描述这个提示词的用途..."
            rows={3}
          />

          {/* Content */}
          <div>
            <MarkdownEditor
              label="提示词内容"
              value={values.content}
              onChange={(value) => handleChange('content', value)}
              error={errors.content}
              placeholder="请输入提示词内容..."
              height="500px"
              showToolbar={true}
              showPreview={true}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              分类（可选）
            </label>
            <select
              value={values.category_id || ''}
              onChange={(e) => handleChange('category_id', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">选择分类</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              设置
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_favorite"
                  checked={values.is_favorite}
                  onChange={(e) => handleChange('is_favorite', e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="is_favorite" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                  标记为收藏
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={values.is_public}
                  onChange={(e) => handleChange('is_public', e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                  公开分享
                </label>
                <p className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  （其他用户可以查看和使用）
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}