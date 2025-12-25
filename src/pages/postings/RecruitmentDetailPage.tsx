import { useEffect, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import {
  getRecruitmentDetail,
  deleteRecruitment,
  getMyRecruitments,
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
  const [isAuthor, setIsAuthor] = useState(false)
  const { loginState } = useAuthStore()
  const isLoggedIn = loginState === 'USER'

  useEffect(() => {
    if (!id) return

    const fetchDetail = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getRecruitmentDetail(id)
        setRecruitment(data)
      } catch {
        setError('공고를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
  }, [id])

  useEffect(() => {
    if (!id || !isLoggedIn) {
      setIsAuthor(false)
      return
    }

    const checkAuthor = async () => {
      try {
        const myRecruitments = await getMyRecruitments()
        const myRecruitmentIds = Array.isArray(myRecruitments)
          ? myRecruitments.map((r) => r.uuid)
          : []
        setIsAuthor(myRecruitmentIds.includes(id))
      } catch {
        setIsAuthor(false)
      }
    }

    checkAuthor()
  }, [id, isLoggedIn])

  const handleBookmark = () => {
    showToast.warning('준비 중', '북마크 기능은 추후 업데이트 예정입니다.')
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      showToast.success('링크 복사', '링크가 클립보드에 복사되었습니다')
    } catch {
      showToast.error('복사 실패', '링크 복사에 실패했습니다')
    }
  }

  const handleDelete = async () => {
    if (!id) return

    const confirmed = window.confirm('정말 삭제하시겠습니까?')
    if (!confirmed) return

    try {
      await deleteRecruitment(id)
      showToast.success('삭제 완료', '공고가 삭제되었습니다')
      navigate('/recruitments')
    } catch {
      showToast.error('삭제 실패', '공고 삭제에 실패했습니다')
    }
  }

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
          onDelete={isAuthor ? handleDelete : undefined}
          onBookmark={handleBookmark}
          onShare={handleShare}
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
