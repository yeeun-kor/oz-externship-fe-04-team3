import { Bookmark, Calendar, Eye, User } from 'lucide-react'
import type { Recruitment } from '@/types/recruitment'

interface RecruitmentCardProps {
  recruitment: Recruitment
  onClick?: (id: string) => void
}

export default function RecruitmentCard({
  recruitment,
  onClick,
}: RecruitmentCardProps) {
  const handleClick = () => {
    onClick?.(recruitment.id)
  }

  const lectures = recruitment.lectureList ?? []

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-3 transition-shadow hover:shadow-lg md:px-6 md:py-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row md:gap-4">
        <div className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 sm:h-32 sm:w-48">
          {recruitment.thumbnailType === 'image' ? (
            <img
              src={recruitment.thumbnail}
              alt={recruitment.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-4xl">{recruitment.thumbnail}</span>
          )}
        </div>

        <div className="min-w-0 flex-1 sm:pl-6">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <h3 className="line-clamp-2 flex-1 text-base font-bold md:text-lg">
              {recruitment.title}
            </h3>

            <div className="flex items-center gap-3 text-xs text-gray-600 md:text-sm">
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>{recruitment.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bookmark className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>{recruitment.bookmarks}</span>
              </div>
            </div>
          </div>

          <div className="mb-2 flex items-center gap-2 text-xs text-gray-600 md:text-sm">
            <User className="h-3.5 w-3.5 text-gray-600 md:h-4 md:w-4" />
            <span>모집 인원 : {recruitment.maxParticipants}명</span>
          </div>

          {recruitment.deadline && (
            <div className="mb-2 flex items-center gap-2 text-xs text-gray-600 md:text-sm">
              <Calendar className="h-4 w-4" />
              <span>마감일 : {recruitment.deadline}</span>
            </div>
          )}

          {lectures.length > 0 && (
            <div className="mt-2 mb-3 flex flex-col">
              <p className="mb-1 text-xs font-semibold text-gray-600 md:text-sm">
                강의 목록 :
              </p>

              <ul className="space-y-1 text-xs text-gray-600 md:text-sm">
                {lectures.slice(0, 2).map((lecture) => (
                  <li key={lecture.id} className="leading-relaxed">
                    • {lecture.title} - {lecture.instructor}
                  </li>
                ))}

                {lectures.length > 2 && (
                  <li className="text-gray-400">
                    외 {lectures.length - 2}개 강의
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {recruitment.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800 md:px-3"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
