import { axiosInstance } from '@/api/axios'

type RecruitmentParams = {
  search?: string
  category?: string
  sort?: string
}

/** 모집글 목록 조회 */
export const getRecruitments = async (params: RecruitmentParams) => {
  const queryParams = new URLSearchParams()
  if (params.search) queryParams.append('search', params.search)
  if (params.category) queryParams.append('category', params.category)
  if (params.sort) queryParams.append('sort', params.sort)

  const res = await axiosInstance.get(
    `/v1/recruitments?${queryParams.toString()}`
  )
  return res.data
}

export const getRecruitmentDetail = async (id: string) => {
  const res = await axiosInstance.get(`/v1/recruitments/${id}`)
  return res.data
}

export const incrementRecruitmentViews = async (id: string) => {
  await axiosInstance.post(`/v1/recruitments/${id}/views`)
}

export interface ApplicationFormData {
  introduction: string
  motivation: string
  goal: string
  availableTime: string
  hasExperience: boolean
  experienceDescription: string
}

export const postApplication = async (
  recruitmentId: number,
  data: ApplicationFormData
) => {
  const res = await axiosInstance.post(
    `/v1/recruitments/${recruitmentId}/apply`,
    data
  )
  return res.data
}
