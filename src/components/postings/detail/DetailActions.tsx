import { Bookmark, Share2, Send } from 'lucide-react'
import { Button } from '@/components/common'

interface Props {
  isAuthor: boolean
  onApply?: () => void
  onBookmark?: () => void
  onShare?: () => void
}

export default function DetailActions({
  isAuthor,
  onApply,
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

        <div className="flex gap-2">
          {!isAuthor && onApply && (
            <Button
              onClick={onApply}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500"
            >
              <Send className="h-4 w-4" />
              지원하기
            </Button>
          )}

          {isAuthor && (
            <>
              <Button variant="outline">수정하기</Button>
              <Button variant="danger">삭제하기</Button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
