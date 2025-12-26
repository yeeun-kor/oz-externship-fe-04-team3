import type { Recruitment } from '@/types/recruitment'
import { Calendar, DollarSign, GraduationCap, Users } from 'lucide-react'

interface Props {
  recruitment: Recruitment
}

export default function DetailInfo({ recruitment }: Props) {
  const truncateTitle = (title?: string, maxLength: number = 15) => {
    if (!title) return '-'
    if (title.length <= maxLength) return title
    return title.slice(0, maxLength) + '...'
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) {
      return '-'
    }

    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        return '-'
      }
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    } catch {
      return '-'
    }
  }

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
        <Users className="mx-auto mb-2 h-6 w-6 text-gray-400" />
        <p className="mb-1 text-xs text-gray-600">모집 인원</p>
        <p className="font-bold">
          {recruitment.participants
            ? `${recruitment.participants}/${recruitment.maxParticipants}명`
            : `${recruitment.maxParticipants}명`}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
        <DollarSign className="mx-auto mb-2 h-6 w-6 text-gray-400" />
        <p className="mb-1 text-xs text-gray-600">예상 비용</p>
        <p className="font-bold">
          {recruitment.estimatedFee
            ? `${recruitment.estimatedFee.toLocaleString('ko-KR')}원`
            : '미정'}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
        <Calendar className="mx-auto mb-2 h-6 w-6 text-gray-400" />
        <p className="mb-1 text-xs text-gray-600">마감일</p>
        <p className="font-bold">{formatDate(recruitment.deadline)}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
        <GraduationCap className="mx-auto mb-2 h-6 w-6 text-gray-400" />
        <p className="mb-1 text-xs text-gray-600">스터디 그룹</p>
        <p className="text-sm font-bold">{truncateTitle(recruitment.title)}</p>
      </div>
    </div>
  )
}
