import CardSkeleton from '@/components/common/CardSkeleton'
import { Bell, LogIn, UserPlus } from 'lucide-react'

export default function PublicBanner() {
  return (
    <div className="mb-6 flex w-full flex-col items-center justify-center rounded-lg border-2 border-yellow-200 bg-amber-50 p-8 md:mb-8 md:p-12">
      <div className="flex flex-col items-center justify-center px-4 py-4">
        <Bell className="mb-6 h-16 w-16 text-yellow-500 md:mb-8 md:h-20 md:w-20" />
        <h3 className="mb-4 text-center text-2xl font-bold md:text-3xl">
          개인 맞춤 스터디 공고를 받아보세요
        </h3>
        <p className="mb-8 max-w-2xl text-center text-base leading-relaxed text-gray-600 md:text-lg">
          로그인하시면 관심 분야와 수강 강의를 바탕으로 맞춤형 스터디 공고를
          추천해드립니다
        </p>

        <div className="mb-6 flex flex-col justify-center gap-4 sm:flex-row">
          <button className="flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-8 py-3 text-base font-medium text-white hover:bg-yellow-500">
            <LogIn className="h-5 w-5" /> 로그인하기
          </button>
          <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-8 py-3 text-base font-medium hover:bg-gray-50">
            <UserPlus className="h-5 w-5" /> 회원가입하기
          </button>
        </div>

        <p className="text-sm text-gray-500 md:text-base">
          로그인 후 맞춤 추천을 받을 수 있어요
        </p>
      </div>

      <div className="mt-10 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
