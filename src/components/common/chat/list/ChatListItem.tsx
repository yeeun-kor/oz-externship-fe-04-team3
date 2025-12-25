import type { ChatRoomListItem } from '@/types/chat'
import { formatMonthDay } from '@/utils/format'
import { ChatBadge } from '../common'

interface ChatListItemProps {
  chatRoom: ChatRoomListItem
  onClick?: (roomId: number) => void
}

export function ChatListItem({ chatRoom, onClick }: ChatListItemProps) {
  const latestMessage = chatRoom.last_message

  const previewMessage = latestMessage
    ? `${latestMessage.sender.nickname}: ${latestMessage.content}`
    : `(대화가 없습니다. 대화를 시작해보세요.)`

  const dateLabel = latestMessage
    ? formatMonthDay(latestMessage.created_at)
    : ''

  return (
    <li className="border-custom-gray-200 group border-t first:border-t-0">
      <button
        type="button"
        onClick={() => onClick?.(chatRoom.group_id)}
        className="flex w-full flex-col gap-1 p-3 pb-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-custom-gray-900 group-hover:text-primary-600 text-sm transition-colors duration-150">
            {chatRoom.group_name}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-custom-gray-500 text-xs">{dateLabel}</span>
            <span>
              <ChatBadge count={chatRoom.unread_count} />
            </span>
          </div>
        </div>
        <span className="text-custom-gray-600 truncate text-start text-xs">
          {previewMessage}
        </span>
      </button>
    </li>
  )
}
