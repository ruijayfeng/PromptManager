import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { usePromptStore } from '../stores/prompt'
import { PromptForm } from '../components/prompt/PromptForm'

export function PromptEdit() {
  const { id } = useParams<{ id: string }>()
  const { currentPrompt, fetchPrompt } = usePromptStore()

  useEffect(() => {
    if (id) {
      fetchPrompt(parseInt(id))
    }
  }, [id, fetchPrompt])

  if (!currentPrompt) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">加载中...</span>
      </div>
    )
  }

  return (
    <PromptForm
      initialData={{
        id: currentPrompt.id,
        title: currentPrompt.title,
        content: currentPrompt.content,
        description: currentPrompt.description || '',
        is_public: currentPrompt.is_public,
        is_favorite: currentPrompt.is_favorite,
        category_id: currentPrompt.category_id,
        tag_ids: currentPrompt.tags.map(tag => tag.id)
      }}
      isEditing={true}
    />
  )
}