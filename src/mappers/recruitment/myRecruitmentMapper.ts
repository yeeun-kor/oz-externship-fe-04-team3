import type { MyRecruitmentDetailResponse } from '@/types/myRecruitment'

export type WriteRecruitmentDetail = {
  title: string
  content: string
  estimated_fee?: number
  expected_headcount: number
  close_at: string
  tags: { id: number; name: string }[]
  image_urls?: string | string[]
  study_group?: number
  files?: { file_name: string; file_url: string }[]
}

export const mapMyRecruitmentDetailToWrite = (
  res: MyRecruitmentDetailResponse
): WriteRecruitmentDetail => ({
  title: res.title,
  content: res.content ?? '',
  estimated_fee: res.estimated_fee,
  expected_headcount: res.expected_headcount,
  close_at: res.close_at ?? '',
  tags: res.tags ?? [],
  image_urls: res.image_urls,
  study_group: res.study_group_id,
  files: res.files,
})
