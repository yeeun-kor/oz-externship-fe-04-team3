import { axiosInstance } from '@/api/axios'

type RecruitmentParams = {
  search?: string
  category?: string
  sort?: string
}

export const getRecruitmentsV1 = async (params: RecruitmentParams) => {
  const queryParams = new URLSearchParams()
  if (params.search) queryParams.append('search', params.search)
  if (params.category) queryParams.append('category', params.category)
  if (params.sort) queryParams.append('sort', params.sort)

  const res = await axiosInstance.get(
    `/v1/recruitments?${queryParams.toString()}`
  )
  return res.data
}

export const getRecruitmentDetailV1 = async (id: string) => {
  const res = await axiosInstance.get(`/v1/recruitments/${id}`)
  return res.data
}

export const incrementRecruitmentViewsV1 = async (id: string) => {
  await axiosInstance.post(`/v1/recruitments/${id}/views`)
}

export const getRecruitments = async (params: RecruitmentParams) => {
  const queryParams = new URLSearchParams()
  if (params.search) queryParams.append('search', params.search)
  if (params.category) queryParams.append('category', params.category)
  if (params.sort) queryParams.append('sort', params.sort)

  const res = await axiosInstance.get(`/recruitments?${queryParams.toString()}`)
  return res.data
}

export const getRecruitmentDetail = async (id: string) => {
  const res = await axiosInstance.get(`/recruitments/${id}`)
  return res.data
}

export const incrementRecruitmentViews = async (id: string) => {
  await axiosInstance.post(`/recruitments/${id}/views`)
}
