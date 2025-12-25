import { isAxiosError } from 'axios'

import { axiosInstance } from '@/api/axios'
import {
  alarmMapper,
  type NotificationListResponse,
} from '@/mappers/notification/mapper'
import type { AlarmItem } from '@/types/alarm'
import { useCursorInfiniteQuery } from './useCursorInfiniteQuery'
import { useQueryClient } from '@tanstack/react-query'

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
        const mapped = data.results.map((item) =>
          alarmMapper({
            ...item,
            // 서버가 is_read를 잘못 내려줄 때를 대비해 필터에 따라 보정
            is_read: filter === 'unread' ? false : item.is_read,
          })
        )
        return {
          next: data.next,
          previous: data.previous,
          total: data.total,
          unread_total: (data as any).unread_total,
          results: mapped,
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

  const meta = query.data?.pages?.[0]
  const totalCount = meta?.total ?? alarms.length
  const unreadCount = meta?.unread_total ?? 0
  const readCount = Math.max(0, totalCount - unreadCount)

  return {
    alarms,
    errorMessage,
    totalCount,
    unreadCount,
    readCount,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    refetch: query.refetch,
  }
}

export const useNotificationActions = () => {
  const queryClient = useQueryClient()

  const invalidateNotificationCaches = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }

  const markAllRead = async () => {
    const res = await axiosInstance.post('/v1/notifications/read-all')
    invalidateNotificationCaches()
    return res
  }

  const markRead = async (id: string | number) => {
    const res = await axiosInstance.post(`/v1/notifications/${id}/read`)
    invalidateNotificationCaches()
    return res
  }

  return { markAllRead, markRead }
}
