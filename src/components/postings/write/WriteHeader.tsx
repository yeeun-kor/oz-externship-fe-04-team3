import { Button } from '@/components/common'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'

export default function WriteHeader() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const recruitmentId = searchParams.get('recruitmentId')
  const isEditing = location.pathname.includes('/edit') || !!recruitmentId

  return (
    <div className="flex-between flex-col gap-8 md:flex-row">
      <div className="flex-center mr-auto gap-4">
        <Button
          variant="ghost"
          className="h-10 w-10 cursor-pointer rounded-full bg-gray-100 hover:bg-gray-200"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isEditing ? '스터디 구인 공고 수정' : '스터디 구인 공고 작성'}
          </h2>
          <p className="text-base text-gray-500">
            {isEditing
              ? '기존 공고를 수정하고 저장할 수 있습니다.'
              : '스터디 그룹의 새로운 맴버를 모집하는 공고를 작성해보세요'}
          </p>
        </div>
      </div>
    </div>
  )
}
