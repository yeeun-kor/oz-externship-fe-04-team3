import { useApplicationForm } from '@/hooks/useApplicationForm'
import { Button } from '@/components/common'

interface ApplicationFormProps {
  recruitmentId: number
  onSuccess?: () => void
  onCancel?: () => void
}

function TextareaWithCounter({
  label,
  name,
  value,
  onChange,
  placeholder,
  maxLength,
  required,
  error,
}: {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  maxLength: number
  required?: boolean
  error?: string
}) {
  return (
    <div>
      <p className="mb-2 text-sm text-gray-700">
        {label} {required && <span className="ml-1 text-red-500">*</span>}
      </p>
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="focus:border-primary min-h-[120px] w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none"
      />
      <p className="mt-1 text-sm text-gray-500">
        {value.length}/{maxLength}
      </p>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default function ApplicationForm({
  recruitmentId,
  onSuccess,
  onCancel,
}: ApplicationFormProps) {
  const { formData, errors, isSubmitting, updateField, handleSubmit } =
    useApplicationForm(recruitmentId)

  const onSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmit(e)
    if (success && onSuccess) {
      onSuccess()
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <TextareaWithCounter
        label="자기소개"
        name="introduction"
        value={formData.introduction}
        onChange={(val) => updateField('introduction', val)}
        placeholder="본인에 대해 간략하게 소개해주세요. (학습 배경, 관심 분야, 현재 수준 등)"
        maxLength={500}
        required
        error={errors.introduction}
      />

      <TextareaWithCounter
        label="지원 동기"
        name="motivation"
        value={formData.motivation}
        onChange={(val) => updateField('motivation', val)}
        placeholder="이 스터디에 지원하게 된 동기를 작성해주세요."
        maxLength={500}
        required
        error={errors.motivation}
      />

      <TextareaWithCounter
        label="스터디 목표"
        name="goal"
        value={formData.goal}
        onChange={(val) => updateField('goal', val)}
        placeholder="이 스터디를 통해 달성하고 싶은 목표를 작성해주세요."
        maxLength={500}
        required
        error={errors.goal}
      />

      <TextareaWithCounter
        label="가능한 시간대"
        name="availableTime"
        value={formData.availableTime}
        onChange={(val) => updateField('availableTime', val)}
        placeholder="스터디 참여가 가능한 요일과 시간대를 작성해주세요. (예: 평일 저녁 7-9시, 주말 오후)"
        maxLength={500}
        required
        error={errors.availableTime}
      />

      <div>
        <p className="mb-2 text-sm text-gray-700">스터디 경험 유무</p>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.hasExperience}
            onChange={(e) => updateField('hasExperience', e.target.checked)}
          />
          <span className="text-sm">스터디 참여 경험이 있습니다</span>
        </label>
      </div>

      <TextareaWithCounter
        label="구체적인 스터디 경험"
        name="experienceDescription"
        value={formData.experienceDescription}
        onChange={(val) => updateField('experienceDescription', val)}
        placeholder="스터디 경험이 없으시다면 비워두셔도 됩니다."
        maxLength={500}
        error={errors.experienceDescription}
      />

      <p className="text-sm text-gray-600">
        * 표시된 항목은 필수 입력 사항입니다.
      </p>

      <div className="flex justify-end gap-4 border-t border-gray-200 pt-4">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          취소
        </Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? '제출 중' : '지원서 제출'}
        </Button>
      </div>
    </form>
  )
}
