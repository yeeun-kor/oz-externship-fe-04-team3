import type {
  MyRecruitmentPageResponse,
  MyRecruitmentParams,
  MyRecruitmentDetail,
} from '@/types/myRecruitment'
import { axiosInstance } from './axios'

export default async function getMyRecruitmentListApi(
  params: MyRecruitmentParams = {}
): Promise<MyRecruitmentPageResponse> {
  const queryParams: Record<string, string | number | string[] | boolean> = {}

  if (params.page) queryParams.page = params.page
  if (params.page_size) queryParams.page_size = params.page_size
  if (params.search) queryParams.search = params.search
  if (params.sort) queryParams.sort = params.sort
  if (params.tags?.length) queryParams.tags = params.tags
  if (params.is_closed !== undefined) queryParams.is_closed = params.is_closed

  const { data } = await axiosInstance.get<MyRecruitmentPageResponse>(
    '/v1/recruitments/mine',
    { params: queryParams }
  )
  return data
}

export async function deleteMyRecruitment(id: string) {
  await axiosInstance.delete(`/v1/recruitments/${id}`)
}

export async function getMyRecruitmentDetail(
  id: string
): Promise<MyRecruitmentDetail> {
  const { data } = await axiosInstance.get(`/v1/recruitments/${id}`)
  return data
}
