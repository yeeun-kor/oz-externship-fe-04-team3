import { Button } from '@/components/common'
import { ArrowLeft, X } from 'lucide-react'

interface ChatHeaderProps {
  title: string
  onlineCount?: number
  totalUnreadCount?: number
  showBackButton?: boolean
  onBack?: () => void
  onClose: () => void
}

export function ChatHeader({
  title,
  onlineCount,
  totalUnreadCount = 0,
  showBackButton,
  onBack,
  onClose,
}: ChatHeaderProps) {
  return (
    <header className="bg-custom-gray-50 border-b-custom-gray-200 flex h-16 items-center justify-between gap-2 border-b p-4">
      {showBackButton && (
        <Button variant="ghost" onClick={onBack} className="h-8 w-8 p-0">
          <ArrowLeft className="text-custom-gray-600 h-4 w-4" />
        </Button>
      )}

      <div className="flex-1">
        <div className="flex flex-col">
          <span className="text-custom-gray-900 truncate text-sm font-semibold">
            {title}
          </span>

          {!showBackButton && (
            <span className="text-primary-600 text-xs">
              {totalUnreadCount}개의 읽지 않은 메시지
            </span>
          )}
        </div>

        {typeof onlineCount === 'number' && (
          <div className="text-custom-gray-600 text-xs">
            <span className="bg-success-500 mr-1 inline-block h-2 w-2 rounded-full" />
            <span>{onlineCount}명 온라인</span>
          </div>
        )}
      </div>

      <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
        <X className="text-custom-gray-400 h-4 w-4" />
      </Button>
    </header>
  )
}
