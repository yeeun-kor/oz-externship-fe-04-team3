import { isAxiosError } from 'axios'

import { axiosInstance } from '@/api/axios'
import {
  alarmMapper,
  type NotificationListResponse,
} from '@/mappers/notification/mapper'
import type { AlarmItem } from '@/types/alarm'
import { useCursorInfiniteQuery } from './useCursorInfiniteQuery'

type FilterKey = 'all' | 'unread' | 'read'

// 커서 기반 알림 조회 훅
export const useNotifications = (filter: FilterKey) => {
  const query = useCursorInfiniteQuery<AlarmItem>({
    queryKey: ['notifications', filter],
    queryFn: async (cursorUrl) => {
      try {
        const isReadParam = filter === 'all' ? undefined : filter === 'read'
        const { data } = cursorUrl
          ? await axiosInstance.get<NotificationListResponse>(cursorUrl)
          : await axiosInstance.get<NotificationListResponse>(
              '/v1/notifications',
              {
                params: {
                  page_size: 10,
                  ...(typeof isReadParam === 'boolean'
                    ? { is_read: isReadParam }
                    : {}),
                },
              }
            )
        return {
          next: data.next,
          previous: data.previous,
          results: data.results.map(alarmMapper),
        }
      } catch (err) {
        if (isAxiosError(err)) {
          const detail = (
            err.response?.data as { error_detail?: string } | undefined
          )?.error_detail
          throw new Error(detail || '알림을 불러오지 못했습니다.')
        }
        throw err
      }
    },
  })

  const alarms = query.data?.pages.flatMap((p) => p.results ?? []) ?? []
  const errorMessage = query.error ? query.error.message : null
  const unreadCount = alarms.filter((a) => !a.isRead).length
  const totalCount = alarms.length

  return {
    alarms,
    errorMessage,
    totalCount,
    unreadCount,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    refetch: query.refetch,
  }
}

export const useNotificationActions = () => {
  const markAllRead = () => axiosInstance.post('/v1/notifications/read-all')
  const markRead = (id: string | number) =>
    axiosInstance.post(`/v1/notifications/${id}/read`)

  return { markAllRead, markRead }
}
