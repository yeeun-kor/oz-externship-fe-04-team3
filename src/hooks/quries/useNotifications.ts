import { isAxiosError } from 'axios'

import { axiosInstance } from '@/api/axios'
import {
  alarmMapper,
  type NotificationListResponse,
} from '@/mappers/notification/mapper'
import type { AlarmItem } from '@/types/alarm'
import { useCursorInfiniteQuery } from './useCursorInfiniteQuery'
import { useQuery, useQueryClient } from '@tanstack/react-query'

type FilterKey = 'all' | 'unread' | 'read'

// 커서 기반 알림 조회 훅
export const useNotifications = (filter: FilterKey) => {
  // 총합/미읽음 카운트용 쿼리
  const totalCountQuery = useQuery<number>({
    queryKey: ['notifications-total-count'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<NotificationListResponse>(
        '/v1/notifications',
        { params: { page_size: 1 } }
      )
      return data.total_count ?? data.results.length
    },
    staleTime: 1000 * 60,
  })

  const unreadCountQuery = useQuery<number>({
    queryKey: ['notifications-unread-count'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<NotificationListResponse>(
        '/v1/notifications',
        { params: { page_size: 1, is_read: false } }
      )
      // 백엔드가 unread_count를 내려주면 활용, 없으면 total_count 대체
      const unread =
        data.unread_count ?? data.total_count ?? data.results.length
      return unread
    },
    staleTime: 1000 * 60,
  })

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

  const totalCount = totalCountQuery.data ?? 0
  const unreadCount = unreadCountQuery.data ?? 0
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
    queryClient.invalidateQueries({ queryKey: ['notifications-total-count'] })
    queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
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
