import type { Recruitment } from '@/mocks/recruitmentData'
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Edit,
  Send,
  User,
  Calendar,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { showToast } from '@/components/common/toast/Toast'
import { useState } from 'react'

interface Props {
  recruitment: Recruitment
  onBack: () => void
  onEdit?: () => void
  onApply?: () => void
}

export default function DetailHeader({
  recruitment,
  onBack,
  onEdit,
  onApply,
}: Props) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const formatDate = (dateStr?: string) => {
    if (!dateStr) {
      const now = new Date()
      return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`
    }
    const [year, month, day] = dateStr.split('.')
    return `${year}년 ${month}월 ${day}일`
  }

  const handleBookmark = () => {
    const next = !isBookmarked
    setIsBookmarked(next)
    if (next) {
      showToast.success('북마크 추가', '북마크에 추가되었습니다')
    } else {
      showToast.success('북마크 제거', '북마크에서 제거되었습니다')
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      showToast.success('링크 복사', '링크가 클립보드에 복사되었습니다')
    } catch {
      showToast.error('복사 실패', '링크 복사에 실패했습니다')
    }
  }

  const tags = recruitment.tags ?? []

  return (
    <div className="mb-6">
      <button
        onClick={onBack}
        className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
      >
        <ArrowLeft className="h-6 w-6 text-gray-500" />
      </button>

      <div className="mb-4 flex items-start justify-between gap-4">
        <h1 className="flex-1 text-2xl font-bold md:text-3xl">
          {recruitment.title}
        </h1>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleBookmark}
            className={isBookmarked ? 'bg-yellow-50' : ''}
          >
            <Bookmark
              className={isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''}
            />
          </Button>

          {onEdit ? (
            <Button
              onClick={onEdit}
              variant="primary"
              className="bg-yellow-400 hover:bg-yellow-500"
            >
              <Edit className="h-4 w-4" />
              편집하기
            </Button>
          ) : onApply ? (
            <Button
              onClick={onApply}
              variant="primary"
              className="bg-yellow-400 hover:bg-yellow-500"
            >
              <Send className="h-4 w-4" />
              지원하기
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <User className="h-4 w-4" />
          <span>작성자 : {recruitment.author || '익명'}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>등록일 : {formatDate(recruitment.createdAt)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Eye className="h-4 w-4" />
          <span>조회 {recruitment.views}</span>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-600">
        <Bookmark className="h-4 w-4" />
        <span>북마크 {recruitment.bookmarks}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="rounded bg-yellow-100 px-3 py-1 text-sm text-yellow-800"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
