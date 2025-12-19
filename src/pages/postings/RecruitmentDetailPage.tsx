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
import Modal from '@/components/common/Modal'
import ApplicationForm from '@/components/postings/recruitment/ApplicationForm'
import { showToast } from '@/components/common/toast/Toast'

export default function RecruitmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [recruitment, setRecruitment] = useState<Recruitment | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)

  const currentUserId = 1
  const isAuthor = recruitment?.authorId === currentUserId

  useEffect(() => {
    if (!id) return

    const fetchDetail = async () => {
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

  if (id && isNaN(Number(id))) {
    return <Navigate to="/recruitments" replace />
  }

  if (isLoading) {
    return <div className="p-10 text-center">로딩 중</div>
  }

  if (error || !recruitment) {
    return <div className="p-10 text-center">{error}</div>
  }

  const handleApplySuccess = () => {
    setIsApplicationModalOpen(false)
    showToast.success('지원 완료', '지원서가 성공적으로 제출되었습니다!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl p-4">
        <DetailHeader
          recruitment={recruitment}
          onBack={() => navigate(-1)}
          onEdit={
            isAuthor ? () => navigate(`/recruitments/edit/${id}`) : undefined
          }
          onApply={
            !isAuthor ? () => setIsApplicationModalOpen(true) : undefined
          }
        />

        <DetailInfo recruitment={recruitment} />
        <DetailContent recruitment={recruitment} />
        <DetailActions
          onApply={() => setIsApplicationModalOpen(true)}
          onBookmark={() => {}}
          onShare={() => {}}
        />
      </div>

      <Modal
        open={isApplicationModalOpen}
        onOpenChange={setIsApplicationModalOpen}
        title="스터디 지원서 작성"
        content={
          <ApplicationForm
            recruitmentId={Number(id)}
            onSuccess={handleApplySuccess}
            onCancel={() => setIsApplicationModalOpen(false)}
          />
        }
      />
    </div>
  )
}
