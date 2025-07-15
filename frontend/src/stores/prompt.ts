import { create } from 'zustand'
import { Prompt, PromptList, PromptForm, Category } from '../types'
import { promptService, categoryService, PromptListParams } from '../services/prompt'

interface PromptState {
  // State
  prompts: Prompt[]
  currentPrompt: Prompt | null
  categories: Category[]
  isLoading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    per_page: number
    total_pages: number
  }
  filters: {
    category_id?: number
    is_public?: boolean
    is_favorite?: boolean
    search?: string
  }

  // Actions
  fetchPrompts: (params?: PromptListParams) => Promise<void>
  fetchPrompt: (id: number) => Promise<void>
  createPrompt: (data: PromptForm) => Promise<Prompt>
  updatePrompt: (id: number, data: Partial<PromptForm>) => Promise<Prompt>
  deletePrompt: (id: number) => Promise<void>
  toggleFavorite: (id: number) => Promise<void>
  togglePublic: (id: number) => Promise<void>
  
  fetchCategories: () => Promise<void>
  createCategory: (data: { name: string; description?: string; color?: string }) => Promise<Category>
  updateCategory: (id: number, data: { name?: string; description?: string; color?: string }) => Promise<Category>
  deleteCategory: (id: number) => Promise<void>
  
  setFilters: (filters: Partial<PromptState['filters']>) => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const usePromptStore = create<PromptState>((set, get) => ({
  // Initial state
  prompts: [],
  currentPrompt: null,
  categories: [],
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    per_page: 20,
    total_pages: 0
  },
  filters: {},

  // Actions
  fetchPrompts: async (params = {}) => {
    try {
      set({ isLoading: true, error: null })
      
      const { filters } = get()
      const requestParams = { ...filters, ...params }
      
      const response: PromptList = await promptService.getPrompts(requestParams)
      
      set({
        prompts: response.prompts,
        pagination: {
          total: response.total,
          page: response.page,
          per_page: response.per_page,
          total_pages: response.total_pages
        },
        isLoading: false
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || '获取提示词列表失败'
      })
    }
  },

  fetchPrompt: async (id: number) => {
    try {
      set({ isLoading: true, error: null })
      
      const prompt = await promptService.getPrompt(id)
      
      set({
        currentPrompt: prompt,
        isLoading: false
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || '获取提示词详情失败'
      })
    }
  },

  createPrompt: async (data: PromptForm) => {
    try {
      set({ isLoading: true, error: null })
      
      const newPrompt = await promptService.createPrompt(data)
      
      // 更新列表
      const { prompts } = get()
      set({
        prompts: [newPrompt, ...prompts],
        isLoading: false
      })
      
      return newPrompt
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || '创建提示词失败'
      })
      throw error
    }
  },

  updatePrompt: async (id: number, data: Partial<PromptForm>) => {
    try {
      set({ isLoading: true, error: null })
      
      const updatedPrompt = await promptService.updatePrompt(id, data)
      
      // 更新列表中的项目
      const { prompts } = get()
      const updatedPrompts = prompts.map(prompt =>
        prompt.id === id ? updatedPrompt : prompt
      )
      
      set({
        prompts: updatedPrompts,
        currentPrompt: updatedPrompt,
        isLoading: false
      })
      
      return updatedPrompt
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || '更新提示词失败'
      })
      throw error
    }
  },

  deletePrompt: async (id: number) => {
    try {
      set({ isLoading: true, error: null })
      
      await promptService.deletePrompt(id)
      
      // 从列表中移除
      const { prompts } = get()
      const filteredPrompts = prompts.filter(prompt => prompt.id !== id)
      
      set({
        prompts: filteredPrompts,
        currentPrompt: null,
        isLoading: false
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || '删除提示词失败'
      })
      throw error
    }
  },

  toggleFavorite: async (id: number) => {
    try {
      const { prompts } = get()
      const prompt = prompts.find(p => p.id === id)
      if (!prompt) return

      const updatedPrompt = await promptService.toggleFavorite(id, !prompt.is_favorite)
      
      const updatedPrompts = prompts.map(p =>
        p.id === id ? updatedPrompt : p
      )
      
      set({
        prompts: updatedPrompts,
        currentPrompt: get().currentPrompt?.id === id ? updatedPrompt : get().currentPrompt
      })
    } catch (error: any) {
      set({ error: error.message || '操作失败' })
    }
  },

  togglePublic: async (id: number) => {
    try {
      const { prompts } = get()
      const prompt = prompts.find(p => p.id === id)
      if (!prompt) return

      const updatedPrompt = await promptService.togglePublic(id, !prompt.is_public)
      
      const updatedPrompts = prompts.map(p =>
        p.id === id ? updatedPrompt : p
      )
      
      set({
        prompts: updatedPrompts,
        currentPrompt: get().currentPrompt?.id === id ? updatedPrompt : get().currentPrompt
      })
    } catch (error: any) {
      set({ error: error.message || '操作失败' })
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await categoryService.getCategories()
      set({ categories })
    } catch (error: any) {
      set({ error: error.message || '获取分类列表失败' })
    }
  },

  createCategory: async (data) => {
    try {
      set({ isLoading: true, error: null })
      
      const newCategory = await categoryService.createCategory(data)
      
      const { categories } = get()
      set({
        categories: [...categories, newCategory],
        isLoading: false
      })
      
      return newCategory
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || '创建分类失败'
      })
      throw error
    }
  },

  updateCategory: async (id: number, data) => {
    try {
      set({ isLoading: true, error: null })
      
      const updatedCategory = await categoryService.updateCategory(id, data)
      
      const { categories } = get()
      const updatedCategories = categories.map(cat =>
        cat.id === id ? updatedCategory : cat
      )
      
      set({
        categories: updatedCategories,
        isLoading: false
      })
      
      return updatedCategory
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || '更新分类失败'
      })
      throw error
    }
  },

  deleteCategory: async (id: number) => {
    try {
      set({ isLoading: true, error: null })
      
      await categoryService.deleteCategory(id)
      
      const { categories } = get()
      const filteredCategories = categories.filter(cat => cat.id !== id)
      
      set({
        categories: filteredCategories,
        isLoading: false
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || '删除分类失败'
      })
      throw error
    }
  },

  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }))
  },

  clearError: () => set({ error: null }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading })
}))