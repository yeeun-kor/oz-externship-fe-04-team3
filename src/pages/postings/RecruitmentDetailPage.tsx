import { useEffect, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { getRecruitmentDetail, incrementRecruitmentViews } from '@/api/axios'
import type { Recruitment } from '@/mocks/recruitmentData'
import loginStateStore from '@/store/loginStateStore'
import DetailHeader from '@/components/postings/detail/DetailHeader'
import DetailInfo from '@/components/postings/detail/DetailInfo'
import DetailContent from '@/components/postings/detail/DetailContent'
import DetailActions from '@/components/postings/detail/DetailActions'
import Modal from '@/components/common/Modal'
import ApplicationForm from '@/components/postings/recruitment/ApplicationForm'
import { ToastAlert } from '@/components/common/toast/ToastAlert'

export default function RecruitmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [recruitment, setRecruitment] = useState<Recruitment | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const loginState = loginStateStore((state) => state.loginState)

  const currentUserId = 1
  const isAuthor = recruitment?.authorId === currentUserId

  useEffect(() => {
    if (loginState === 'GUEST') {
      navigate('/login', {
        replace: true,
        state: { from: `/recruitments/${id}` },
      })
      return
    }

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
  }, [id, navigate, loginState])

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const handleBack = () => {
    navigate(-1)
  }

  const handleEdit = () => {
    navigate(`/recruitments/edit/${id}`)
  }

  const handleApply = () => {
    setIsApplicationModalOpen(true)
  }

  const handleApplicationSuccess = () => {
    setIsApplicationModalOpen(false)
    setToastType('success')
    setShowToast(true)
  }

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
          onApply={!isAuthor ? handleApply : undefined}
        />
        <DetailInfo recruitment={recruitment} />
        <DetailContent recruitment={recruitment} />
        <DetailActions
          isAuthor={isAuthor}
          onApply={handleApply}
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
            onSuccess={handleApplicationSuccess}
            onCancel={() => setIsApplicationModalOpen(false)}
          />
        }
      />

      {showToast && (
        <div className="fixed top-4 right-4 z-50 w-96">
          <ToastAlert
            type={toastType}
            title={toastType === 'success' ? '지원 완료' : '지원 실패'}
            message={
              toastType === 'success'
                ? '지원서가 성공적으로 제출되었습니다!'
                : '지원서 제출에 실패했습니다. 다시 시도해주세요.'
            }
            closeToast={() => setShowToast(false)}
          />
        </div>
      )}
    </div>
  )
}
