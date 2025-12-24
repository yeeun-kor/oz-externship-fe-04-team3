import { useEffect, useRef } from 'react'
import { useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { API_BASE_URL } from '@/constant/api'
import {
  alarmMapper,
  type NotificationApiItem,
} from '@/mappers/notification/mapper'
import { useAuthStore } from '@/store/userStore'

type UseNotificationStreamOptions = {
  onMessage?: (data: ReturnType<typeof alarmMapper>) => void
  onUnauthorized?: () => void
}

export function useNotificationStream(options?: UseNotificationStreamOptions) {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((s) => s.accessToken)
  const optionsRef = useRef(options)
  const handledUnauthorizedRef = useRef(false)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  useEffect(() => {
    if (!accessToken) return

    const streamUrl = `${API_BASE_URL}/v1/notifications/stream`
    const es = new EventSourcePolyfill(streamUrl, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    es.onmessage = (event: MessageEvent) => {
      try {
        const raw = JSON.parse(event.data) as NotificationApiItem
        const alarm = alarmMapper(raw)
        // 새 알림을 캐시에 바로 반영해 추가 페칭을 줄입니다.
        const filters: Array<'all' | 'unread' | 'read'> = [
          'all',
          'unread',
          'read',
        ]
        filters.forEach((filterKey) => {
          if (filterKey === 'unread' && alarm.isRead) return
          if (filterKey === 'read' && !alarm.isRead) return
          type CursorPage = {
            next: string | null
            previous: string | null
            results: ReturnType<typeof alarmMapper>[]
          }
          queryClient.setQueryData<InfiniteData<CursorPage>>(
            ['notifications', filterKey],
            (prev) => {
              if (!prev) return prev
              // 중복 알림은 추가하지 않음
              const exists = prev.pages.some((p) =>
                p.results.some((item) => item.id === alarm.id)
              )
              if (exists) return prev
              const [firstPage, ...rest] = prev.pages
              const updatedFirstPage = {
                ...firstPage,
                results: [alarm, ...firstPage.results],
              }
              return {
                ...prev,
                pages: [updatedFirstPage, ...rest],
              }
            }
          )
        })
        // 카운트 쿼리도 무효화하여 상단 카운트 반영
        queryClient.invalidateQueries({
          queryKey: ['notifications-total-count'],
        })
        queryClient.invalidateQueries({
          queryKey: ['notifications-unread-count'],
        })
        optionsRef.current?.onMessage?.(alarm)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('SSE parse error', e)
      }
    }

    type SSEErrorEvent = Event & { status?: number }

    es.onerror = (event: SSEErrorEvent) => {
      if (event.status === 401 && !handledUnauthorizedRef.current) {
        handledUnauthorizedRef.current = true
        optionsRef.current?.onUnauthorized?.()
      }
      es.close()
    }

    return () => {
      es.close()
    }
  }, [accessToken, queryClient])
}
