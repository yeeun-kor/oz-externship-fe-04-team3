import useUserRecommendLecture from '@/hooks/useUserRecommendLecture'
import { useAuthStore } from '@/store/userStore'
import { Badge } from '../common/badge'
import LectureCard from './LectureCard'

export default function LectureRecommendSection() {
  const { data } = useUserRecommendLecture(3)
  /* 유저 상태 */
  const { user } = useAuthStore()
  return (
    <div className="border-primary-200 rounded-xl border bg-linear-to-r from-[#FFF7ED] to-[#FEFCE8] px-4 py-8 md:p-8">
      <div>
        <div className="section-header flex items-baseline gap-2">
          <h3 className="pb-6 text-left text-balance text-gray-900">
            {user?.name} 님을 위한 추천 강의
          </h3>
          <Badge variant={'danger'}>개인맞춤</Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((i) => (
            <LectureCard key={i.id} {...i}></LectureCard>
          ))}
        </div>
      </div>
    </div>
  )
}
