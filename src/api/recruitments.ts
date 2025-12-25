import type {
  Recruitment,
  RecruitmentApiItem,
  RecruitmentApiDetail,
} from '@/types/recruitment'
import {
  mapRecruitmentItem,
  mapRecruitmentDetail,
} from '@/mappers/recruitment/mapper'
import { axiosInstance } from '@/api/axios'

interface PaginatedResponse {
  count: number
  next: string | null
  previous: string | null
  results: RecruitmentApiItem[]
}

export const getRecruitments = async (): Promise<Recruitment[]> => {
  let allRecruitments: Recruitment[] = []
  let nextUrl: string | null = '/v1/recruitments?page_size=100'

  while (nextUrl) {
    const response = await axiosInstance.get<PaginatedResponse>(nextUrl)
    const data: PaginatedResponse = response.data
    const items: RecruitmentApiItem[] = Array.isArray(data)
      ? data
      : (data?.results ?? [])

    allRecruitments = [...allRecruitments, ...items.map(mapRecruitmentItem)]

    if (data?.next) {
      try {
        const urlObj: URL = new URL(data.next)
        nextUrl = urlObj.pathname + urlObj.search
      } catch {
        nextUrl = null
      }
    } else {
      nextUrl = null
    }
  }

  return allRecruitments
}

export const getRecruitmentDetail = async (
  id: string
): Promise<Recruitment> => {
  if (!id) {
    throw new Error('유효하지 않은 공고 ID입니다.')
  }

  const { data } = await axiosInstance.get(`/v1/recruitments/${id}`)

  const item: RecruitmentApiDetail = data?.data ?? data

  return mapRecruitmentDetail(item)
}

export const incrementRecruitmentViews = async (id: string): Promise<void> => {
  if (!id) return
  await axiosInstance.post(`/v1/recruitments/${id}/views`).catch(() => {})
}

export const createRecruitment = async (
  payload: Partial<Recruitment>
): Promise<Recruitment> => {
  const { data } = await axiosInstance.post('/v1/recruitments', payload)
  return data?.data ?? data
}

export const updateRecruitment = async (
  id: string,
  payload: Partial<Recruitment>
): Promise<Recruitment> => {
  const { data } = await axiosInstance.put(`/v1/recruitments/${id}`, payload)
  return data?.data ?? data
}

export const deleteRecruitment = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/v1/recruitments/${id}`)
}

export interface ApplicationData {
  recruitmentId: string
  content: string
  contact?: string
}

export const postApplication = async (
  payload: ApplicationData
): Promise<void> => {
  await axiosInstance.post('/v1/applications', payload)
}

export const getMyRecruitments = async (): Promise<
  { uuid: string; title: string }[]
> => {
  const { data } = await axiosInstance.get('/v1/recruitments/mine')
  return data
}

export interface RecruitmentBookmark {
  id: string
  recruitment_uuid: string
  created_at?: string
}

export const createRecruitmentBookmark = async (
  recruitmentId: string
): Promise<void> => {
  await axiosInstance.post('/v1/recruitment-bookmarks', {
    recruitment_uuid: recruitmentId,
  })
}

export const deleteRecruitmentBookmark = async (
  bookmarkId: string
): Promise<void> => {
  await axiosInstance.delete(`/v1/recruitment-bookmarks/${bookmarkId}`)
}
