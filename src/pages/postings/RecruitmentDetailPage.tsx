import { useEffect, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import {
  getRecruitmentDetail,
  incrementRecruitmentViews,
} from '@/api/recruitments'
import type { Recruitment } from '@/mocks/recruitmentData'
import DetailHeader from '@/components/postings/detail/DetailHeader'
import DetailInfo from '@/components/postings/detail/DetailInfo'
import DetailContent from '@/components/postings/detail/DetailContent'
import DetailActions from '@/components/postings/detail/DetailActions'

export default function RecruitmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [recruitment, setRecruitment] = useState<Recruitment | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentUserId = 1
  const isAuthor = recruitment?.authorId === currentUserId

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return

      setIsLoading(true)
      setError(null)

      try {
        const data = await getRecruitmentDetail(id)
        setRecruitment(data)
        await incrementRecruitmentViews(id)
      } catch {
        setError('공고를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
  }, [id])

  const handleBack = () => {
    navigate(-1)
  }

  const handleEdit = () => {
    navigate(`/recruitments/edit/${id}`)
  }

  const handleApply = () => {}

  if (id && isNaN(Number(id))) {
    return <Navigate to="/recruitments" replace />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">로딩 중</div>
      </div>
    )
  }

  if (error || !recruitment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-gray-500">
            {error || '공고를 찾을 수 없습니다.'}
          </p>
          <button
            onClick={handleBack}
            className="rounded-lg bg-yellow-400 px-6 py-2 text-white hover:bg-yellow-500"
          >
            돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <DetailHeader
          recruitment={recruitment}
          onBack={handleBack}
          onEdit={isAuthor ? handleEdit : undefined}
        />
        <DetailInfo recruitment={recruitment} />
        <DetailContent recruitment={recruitment} />
        <DetailActions
          onApply={handleApply}
          onBookmark={() => {}}
          onShare={() => {}}
        />
      </div>
    </div>
  )
}
