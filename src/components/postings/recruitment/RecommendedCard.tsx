import defalutImage from '@/assets/images/DefaultImage.png'
import type { Recruitment } from '@/types/recruitment'
import { Bookmark, Calendar, Eye, User } from 'lucide-react'

interface Props {
  recruitment: Recruitment
  onClick?: (id: string) => void
}

export default function RecommendedCard({ recruitment, onClick }: Props) {
  const handleClick = () => {
    onClick?.(recruitment.id)
  }

  const lectures = recruitment.lectureList ?? []

  const formattedDeadline = recruitment.deadline
    ? new Date(recruitment.deadline).toLocaleDateString()
    : '-'

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="h-36 w-full overflow-hidden rounded-t-lg md:h-36">
        <img
          src={recruitment.thumbnail || defalutImage}
          alt={recruitment.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-bold">{recruitment.title}</h3>

          <div className="flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {recruitment.views}
            </div>
            <div className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
              {recruitment.bookmarks}
            </div>
          </div>
        </div>

        <div className="mb-1 flex items-center gap-2 text-xs text-gray-700">
          <User className="h-4 w-4 text-gray-400" />
          모집 인원 : {recruitment.maxParticipants}명
        </div>

        <div className="mb-2 flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="h-4 w-4 text-gray-400" />
          마감일 : {formattedDeadline}
        </div>

        {lectures.length > 0 && (
          <div className="mb-3">
            <p className="mb-1 text-xs font-semibold text-gray-600">
              강의 목록 :
            </p>
            <ul className="space-y-0.5 text-xs text-gray-600">
              {lectures.map((lec) => (
                <li key={lec.id}>• {lec.title}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {recruitment.tags.map((tag) => (
            <span
              key={`${recruitment.id}-${tag}`}
              className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
