import { Sparkles } from 'lucide-react'
import type { Recruitment } from '@/types/recruitment'
import RecommendedCard from './RecommendedCard'

interface Props {
  userName: string
  recommended: Recruitment[]
  onClick: (id: string) => void
}

export default function RecommendedSection({
  userName,
  recommended,
  onClick,
}: Props) {
  return (
    <div className="mb-6 rounded-lg border border-yellow-200 bg-amber-50 p-4 md:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="flex items-center gap-2 text-lg font-bold md:text-xl">
            <Sparkles className="h-5 w-5 fill-yellow-500 text-yellow-500" />
            <span className="text-yellow-600">{userName}</span>
            님을 위한 맞춤 스터디 공고
          </h2>
          <span className="rounded bg-orange-400 px-2 py-0.5 text-[10px] text-white">
            개인화 추천
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {recommended.map((item, index) => (
          <RecommendedCard
            key={item.id ?? `recommended-${index}`}
            recruitment={item}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  )
}
