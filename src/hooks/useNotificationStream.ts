import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
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
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
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
