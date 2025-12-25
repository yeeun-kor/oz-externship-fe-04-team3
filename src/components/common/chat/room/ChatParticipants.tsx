import type { ChatParticipant } from '@/types/chat'

const STATUS_INDICATOR = {
  online: 'bg-success-500 h-2 w-2 rounded-full',
  offline: 'bg-custom-gray-300 h-2 w-2 rounded-full',
} as const

const PARTICIPANT_NAME = {
  host: 'text-primary-600 font-semibold text-xs',
  default: 'text-custom-gray-700 text-xs',
} as const

interface ChatParticipantsProps {
  members: ChatParticipant[]
}

export function ChatParticipants({ members }: ChatParticipantsProps) {
  return (
    <div className="border-custom-gray-200 scrollbar-hide h-auto min-h-fit w-full overflow-x-scroll border-b">
      <ul className="bg-custom-gray-50 flex w-full gap-2 p-2 pb-[7px]">
        {members.map((member) => (
          <li
            key={member.id}
            className="bg-custom-gray-50 flex shrink-0 items-center gap-1 rounded-full px-2 py-1 shadow-xs"
          >
            <span
              className={
                member.is_online
                  ? STATUS_INDICATOR.online
                  : STATUS_INDICATOR.offline
              }
            />
            <span
              className={
                member.is_host
                  ? PARTICIPANT_NAME.host
                  : PARTICIPANT_NAME.default
              }
            >
              {member.nickname}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
