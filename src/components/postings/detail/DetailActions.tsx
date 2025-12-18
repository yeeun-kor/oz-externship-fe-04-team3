import { Bookmark, Share2, Send } from 'lucide-react'
import { showToast } from '@/components/common/toast/Toast'

interface Props {
  onApply?: () => void
  onBookmark?: () => void
  onShare?: () => void
}

export default function DetailActions({ onApply, onBookmark, onShare }: Props) {
  const handleApplyClick = () => {
    if (!onApply) {
      showToast.success('준비 중', '지원 기능은 곧 제공될 예정입니다.')
      return
    }
    onApply()
  }

  return (
    <section className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={onBookmark}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Bookmark className="h-4 w-4" />
            북마크
          </button>

          <button
            onClick={onShare}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Share2 className="h-4 w-4" />
            공유하기
          </button>
        </div>

        <button
          onClick={handleApplyClick}
          className="flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-8 py-2 text-sm font-bold text-white hover:bg-yellow-500"
        >
          <Send className="h-4 w-4" />
          지원하기
        </button>
      </div>
    </section>
  )
}
