import { z } from 'zod'

export const applicationSchema = z
  .object({
    introduction: z
      .string()
      .min(1, '자기소개를 입력해주세요')
      .max(500, '500자 이내로 작성해주세요'),
    motivation: z
      .string()
      .min(1, '지원 동기를 입력해주세요')
      .max(500, '500자 이내로 작성해주세요'),
    goal: z
      .string()
      .min(1, '스터디 목표를 입력해주세요')
      .max(500, '500자 이내로 작성해주세요'),
    availableTime: z
      .string()
      .min(1, '가능한 시간대를 입력해주세요')
      .max(500, '500자 이내로 작성해주세요'),
    hasExperience: z.boolean(),
    experienceDescription: z
      .string()
      .max(500, '500자 이내로 작성해주세요')
      .optional(),
  })
  .refine(
    (data) =>
      !data.hasExperience ||
      (data.experienceDescription?.trim().length ?? 0) > 0,
    {
      path: ['experienceDescription'],
      message: '경험이 있다면 상세 설명을 입력해주세요',
    }
  )

export type ApplicationFormData = z.infer<typeof applicationSchema>

export interface RecruitmentApiItem {
  uuid: string
  title: string
  content?: string
  thumbnail_img_url?: string
  expected_headcount?: number
  close_at?: string
  estimated_fee?: string
  views_count?: number
  bookmark_count?: number
  lectures?: Array<{
    id: number
    title: string
    instructor: string
    thumbnail_img_url: string
    discounted_price: number
    original_price?: number
    url_link: string
  }>
  tags?: Array<{
    id: number
    name: string
  }>
  files?: Array<{
    id: string
    name: string
    url: string
    size?: number
    type?: string
  }>
}

export interface RecruitmentApiDetail {
  uuid: string
  title: string
  content?: string
  thumbnail_img_url?: string
  expected_headcount?: number
  participants?: number
  close_at?: string
  created_at?: string
  estimated_fee?: string
  views_count?: number
  bookmark_count?: number
  study_type?: string
  author?: {
    id: number
    name: string
  }
  lectures?: Array<{
    id: number
    title: string
    instructor: string
    thumbnail_img_url: string
    discounted_price: number
    original_price?: number
    url_link: string
  }>
  tags?: Array<{
    id: number
    name: string
  }>
  files?: Array<{
    id: string
    name: string
    url: string
    size?: number
    type?: string
  }>
}

export interface Recruitment {
  id: string
  title: string
  content: string
  maxParticipants: number
  participants?: number
  deadline?: string
  estimatedFee?: string
  studyType?: string
  authorId?: number
  author?: { id: number; name: string }
  views: number
  createdAt: string
  thumbnail?: string
  thumbnailType?: string
  tags: string[]
  bookmarks: number
  points?: number
  lectureList?: Array<{
    id: number
    title: string
    instructor: string
    thumbnail: string
    price: number
    link: string
  }>
  attachments?: Array<{
    id: string
    name: string
    url: string
    size?: number
    type?: string
  }>
}
