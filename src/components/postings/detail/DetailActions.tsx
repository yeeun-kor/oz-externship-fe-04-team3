import { Bookmark, Share2, Send, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/common'

interface Props {
  isAuthor: boolean
  onApply?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onBookmark: () => void
  onShare: () => void
}

export default function DetailActions({
  isAuthor,
  onApply,
  onEdit,
  onDelete,
  onBookmark,
  onShare,
}: Props) {
  return (
    <section className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBookmark}
            className="flex items-center gap-2"
          >
            <Bookmark className="h-4 w-4" />
            북마크
          </Button>

          <Button
            variant="outline"
            onClick={onShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            공유하기
          </Button>
        </div>

        {isAuthor && onEdit && onDelete ? (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" />
              수정
            </button>
            <button
              onClick={onDelete}
              className="flex items-center justify-center gap-2 rounded-lg border border-red-300 px-6 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              삭제
            </button>
          </div>
        ) : (
          onApply && (
            <button
              onClick={onApply}
              className="flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-8 py-2 text-sm font-bold text-white hover:bg-yellow-500"
            >
              <Send className="h-4 w-4" />
              지원하기
            </button>
          )
        )}
      </div>
    </section>
  )
}
