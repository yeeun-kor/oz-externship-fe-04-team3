import { axiosInstance } from '@/api/axios'
import { mapRecruitmentDetail } from '@/mappers/recruitment/mapper'
import type { MyRecruitmentParams } from '@/types/myRecruitment'
import type { Recruitment, RecruitmentApiDetail } from '@/types/recruitment'

export const getRecruitments = async (params: MyRecruitmentParams = {}) => {
  // 객체타입 Record<키값:키밸류>
  const queryParams: Record<string, string | number | string[]> = {}

  if (params.page) queryParams.page = params.page
  if (params.page_size) queryParams.page_size = params.page_size
  if (params.search) queryParams.search = params.search
  if (params.sort) queryParams.sort = params.sort
  if (params.tags && params.tags.length > 0) {
    queryParams.tags = params.tags.join(',')
  }

  const { data } = await axiosInstance.get('/v1/recruitments', {
    params: queryParams,
  })
  return data
}

export const getRecruitmentDetail = async (id: string) => {
  if (!id) {
    throw new Error('유효하지 않은 공고 ID입니다.')
  }

  const { data } = await axiosInstance.get(`/v1/recruitments/${id}`)

  const item: RecruitmentApiDetail = data?.data ?? data

  return mapRecruitmentDetail(item)
}

export const incrementRecruitmentViews = async (id: string) => {
  if (!id) return
  await axiosInstance.post(`/v1/recruitments/${id}/views`).catch(() => {})
}

export const createRecruitment = async (payload: Partial<Recruitment>) => {
  const { data } = await axiosInstance.post('/v1/recruitments', payload)
  return data?.data ?? data
}

export const updateRecruitment = async (
  id: string,
  payload: Partial<Recruitment>
) => {
  const { data } = await axiosInstance.put(`/v1/recruitments/${id}`, payload)
  return data?.data ?? data
}

export const deleteRecruitment = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/v1/recruitments/${id}`)
}

export interface ApplicationData {
  self_introduction: string
  motivation: string
  objective: string
  available_time: string
  has_study_experience: boolean
  study_experience?: string
}

export const postApplication = async (
  recruitmentUuid: string,
  payload: ApplicationData
): Promise<void> => {
  await axiosInstance.post(
    `/v1/recruitments/${recruitmentUuid}/applications`,
    payload
  )
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
