import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastState {
  toasts: Toast[]
  
  // Actions
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearAllToasts: () => void
  
  // Convenience methods
  success: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => void
  error: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => void
  warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => void
  info: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => void
}

const generateId = () => Math.random().toString(36).substring(2, 15)

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = generateId()
    const newToast: Toast = {
      id,
      duration: 5000, // 5 seconds default
      ...toast
    }

    set((state) => ({
      toasts: [...state.toasts, newToast]
    }))

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id)
      }, newToast.duration)
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }))
  },

  clearAllToasts: () => {
    set({ toasts: [] })
  },

  success: (message, options = {}) => {
    get().addToast({
      type: 'success',
      message,
      ...options
    })
  },

  error: (message, options = {}) => {
    get().addToast({
      type: 'error',
      message,
      duration: 8000, // Longer duration for errors
      ...options
    })
  },

  warning: (message, options = {}) => {
    get().addToast({
      type: 'warning',
      message,
      duration: 6000,
      ...options
    })
  },

  info: (message, options = {}) => {
    get().addToast({
      type: 'info',
      message,
      ...options
    })
  }
}))