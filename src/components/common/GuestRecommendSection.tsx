import { ROUTE_PATHS } from '@/constant/route'
import { LogIn, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from './Button'
import CardSkeleton from './CardSkeleton'
type DataProps = {
  title: string
  description: string
}
export default function GuestRecommendSection({
  title,
  description,
}: DataProps) {
  const navigate = useNavigate()
  return (
    <div className="border-primary-200 max-w-[1216px] rounded-xl border bg-linear-to-r from-[#FFF7ED] to-[#FEFCE8] px-4 py-8 md:p-8">
      <div className="text-center">
        <h3 className="text-balance text-gray-900">
          개인 맞춤 {title} 받아보세요
        </h3>
        <p className="md:text-md mt-3 text-sm text-gray-500">
          {description}를 추천해드립니다.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant={'primary'}
            onClick={() => navigate(ROUTE_PATHS.LOGIN)}
          >
            <LogIn />
            로그인하기
          </Button>
          <Button
            variant={'outline-primary'}
            onClick={() => navigate(ROUTE_PATHS.SIGNUP)}
          >
            <UserPlus />
            회원가입 하기
          </Button>
        </div>
        <div className="Skeleton-Section">
          <p className="mt-8 mb-4 text-sm text-pretty text-gray-500">
            로그인 후 이런 맞춤 추천을 받을 수 있어요
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
