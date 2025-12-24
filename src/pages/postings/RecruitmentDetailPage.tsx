import { useEffect, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import {
  getRecruitmentDetail,
  incrementRecruitmentViews,
} from '@/api/recruitments'
import type { Recruitment } from '@/types/recruitment'
import DetailHeader from '@/components/postings/detail/DetailHeader'
import DetailInfo from '@/components/postings/detail/DetailInfo'
import DetailContent from '@/components/postings/detail/DetailContent'
import DetailActions from '@/components/postings/detail/DetailActions'
import Modal from '@/components/common/Modal'
import ApplicationForm from '@/components/postings/recruitment/ApplicationForm'
import { showToast } from '@/components/common/toast/Toast'
import { useAuthStore } from '@/store/userStore'

export default function RecruitmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [recruitment, setRecruitment] = useState<Recruitment | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)

  const { user, loginState } = useAuthStore()
  const isLoggedIn = loginState === 'USER'
  const isAuthor = isLoggedIn && recruitment?.authorId === user?.id

  useEffect(() => {
    if (!id) return

    const fetchDetail = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getRecruitmentDetail(id)
        setRecruitment(data)
        await incrementRecruitmentViews(id).catch(() => {})
      } catch {
        setError('공고를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
  }, [id])

  if (!id) {
    return <Navigate to="/recruitments" replace />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">로딩 중</p>
      </div>
    )
  }

  if (error || !recruitment) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <p className="mb-4 text-xl font-bold text-gray-800">{error}</p>
          <button
            onClick={() => navigate('/recruitments')}
            className="mt-6 rounded-lg bg-yellow-400 px-6 py-2 font-medium text-white hover:bg-yellow-500"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  const handleApplySuccess = () => {
    setIsApplicationModalOpen(false)
    showToast.success('지원 완료', '지원서가 제출되었습니다.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl p-4">
        <DetailHeader recruitment={recruitment} onBack={() => navigate(-1)} />
        <DetailInfo recruitment={recruitment} />
        <DetailContent recruitment={recruitment} />
        <DetailActions
          isAuthor={isAuthor}
          onApply={
            isLoggedIn && !isAuthor
              ? () => setIsApplicationModalOpen(true)
              : undefined
          }
          onEdit={
            isAuthor ? () => navigate(`/recruitments/edit/${id}`) : undefined
          }
          onDelete={
            isAuthor
              ? () => showToast.warning('준비 중', '삭제 기능 준비중')
              : undefined
          }
          onBookmark={() => {}}
          onShare={() => {}}
        />
      </div>

      {isLoggedIn && !isAuthor && (
        <Modal
          open={isApplicationModalOpen}
          onOpenChange={setIsApplicationModalOpen}
          title="스터디 지원서 작성"
          content={
            <ApplicationForm
              recruitmentId={id}
              onSuccess={handleApplySuccess}
              onCancel={() => setIsApplicationModalOpen(false)}
            />
          }
        />
      )}
    </div>
  )
}
