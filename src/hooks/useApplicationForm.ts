import { useState } from 'react'
import {
  applicationSchema,
  type ApplicationFormData,
} from '@/types/recruitment'
import { postApplication } from '@/api/recruitments'

export function useApplicationForm(recruitmentId: number) {
  const [formData, setFormData] = useState<ApplicationFormData>({
    introduction: '',
    motivation: '',
    goal: '',
    availableTime: '',
    hasExperience: false,
    experienceDescription: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (
    field: keyof ApplicationFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = applicationSchema.safeParse(formData)

    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        const key = err.path[0]
        if (key) newErrors[String(key)] = err.message
      })
      setErrors(newErrors)
      return false
    }

    try {
      setIsSubmitting(true)
      await postApplication(recruitmentId, formData)
      return true
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
  }
}
