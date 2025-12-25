import { axiosInstance } from './axios'

export type RecruitmentTag = {
  id: number
  name: string
}

export type RecruitmentTagListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: RecruitmentTag[]
}

export type RecruitmentTagParams = {
  keyword?: string
  page?: number
  page_size?: number
}

export const getRecruitmentTags = async (
  params: RecruitmentTagParams
): Promise<RecruitmentTagListResponse> => {
  const { data } = await axiosInstance.get<RecruitmentTagListResponse>(
    '/v1/recruitment-tags',
    { params }
  )
  return data
}

export const createRecruitmentTag = async (
  name: string
): Promise<RecruitmentTag> => {
  const { data } = await axiosInstance.post<RecruitmentTag>(
    '/v1/recruitment-tags',
    { name }
  )
  return data
}
