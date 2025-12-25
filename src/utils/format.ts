import { eachMinuteOfInterval, format } from 'date-fns'
import { ko } from 'date-fns/locale'

// yyyy년 M월 d일
export function formatYearMonthDay(dateStr: string) {
  return format(new Date(dateStr), 'yyyy년 M월 d일', { locale: ko })
}

// M월 d일
export function formatMonthDay(dateStr: string) {
  return format(new Date(dateStr), 'M월 d일', { locale: ko })
}

// HH:mm
export function formatTimeHHmm(dateStr: string) {
  return format(new Date(dateStr), 'HH:mm', { locale: ko })
}

// yyyy. M. d.
export function formatDotDate(dateStr: string) {
  return format(new Date(dateStr), 'yyyy. M. d.', { locale: ko })
}

// yyyy. MM. dd. a h:mm
export function formatDateTime(
  dateStr: string,
  pattern: string = 'yyyy. MM. dd. a h:mm'
) {
  return format(new Date(dateStr), pattern, { locale: ko })
}

// 새 스케줄 추가 시작/종료 시간
export function createTimeOptions(step = 10) {
  const times = eachMinuteOfInterval(
    {
      start: new Date(2000, 0, 1, 0, 0),
      end: new Date(2000, 0, 1, 23, 59),
    },
    { step }
  )

  return times.map((date) => ({
    // 내부 로직 및 서버 요청에 사용되는 24시간제 시간 문자열 - 00:00
    value: format(date, 'HH:mm'),
    // UI 오전/오후 기반 12시간제 시간 문자열 - 오전/오후 0:00
    label: format(date, 'a h:mm', { locale: ko }),
  }))
}

export function formatMinutesToHHMM(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const paddedHours = String(hours).padStart(2, '0')
  const paddedMinutes = String(mins).padStart(2, '0')
  return `${paddedHours}:${paddedMinutes}`
}

// HH:mm to minutes
export function timeToMinutes(time: string) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}
