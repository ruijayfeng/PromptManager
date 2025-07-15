import { useState, useCallback } from 'react'

type ValidationRule<T> = {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: T) => string | null
}

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>
}

type FormErrors<T> = {
  [K in keyof T]?: string
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: ValidationRules<T>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>)

  const validateField = useCallback((name: keyof T, value: T[keyof T]): string | null => {
    const rules = validationRules?.[name]
    if (!rules) return null

    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return '此字段为必填项'
    }

    // String validations
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `最少需要 ${rules.minLength} 个字符`
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return `最多允许 ${rules.maxLength} 个字符`
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        return '格式不正确'
      }
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(value)
    }

    return null
  }, [validationRules])

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors<T> = {}
    let isValid = true

    Object.keys(values).forEach((key) => {
      const fieldName = key as keyof T
      const error = validateField(fieldName, values[fieldName])
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [values, validateField])

  const handleChange = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }, [errors])

  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const error = validateField(name, values[name])
    setErrors(prev => ({ ...prev, [name]: error || undefined }))
  }, [values, validateField])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({} as Record<keyof T, boolean>)
  }, [initialValues])

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    setFieldError,
    isValid: Object.keys(errors).length === 0
  }
}