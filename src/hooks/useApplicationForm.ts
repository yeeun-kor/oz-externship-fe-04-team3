import { useState } from 'react'
import {
  applicationSchema,
  type ApplicationFormData,
} from '@/types/recruitment'
import { postApplication } from '@/api/recruitment'

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
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = applicationSchema.safeParse(formData)

    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[String(err.path[0])] = err.message
        }
      })
      setErrors(newErrors)
      return false
    }

    try {
      setIsSubmitting(true)
      await postApplication(recruitmentId, formData)
      return true
    } catch {
      return false
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
