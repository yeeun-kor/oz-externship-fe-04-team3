export type MyRecruitmentApiItem = {
  uuid: string
  title: string
  thumbnail_img_url: string
  expected_headcount: number
  close_at: string
  views_count: number
  bookmark_count: number
  lectures: { id: number; title: string; instructor: string }[]
  tags: { id: number; name: string }[]
}

export type MyRecruitmentPageResponse = {
  count: number
  next: string | null
  previous: string | null
  results: MyRecruitmentApiItem[]
}

export type ManageRecruitment = {
  uuid: string
  title: string
  thumbnailImgUrl: string
  expectedHeadcount: number
  closeAt: string
  viewsCount: number
  bookmarkCount: number
  lectures: { id: number; title: string; instructor: string }[]
  tags: { id: number; name: string }[]
  isClosed: boolean
}

export type MyRecruitmentParams = {
  page?: number
  page_size?: number
  search?: string
  sort?: 'latest' | 'oldest' | 'most_views' | 'most_bookmarks'
  tags?: string[]
  is_closed?: boolean
}

export type MyRecruitmentDetail = ManageRecruitment & {
  content: string
  estimated_fee?: number
  image_urls?: string[]
}

export type MyRecruitmentDetailResponse = {
  uuid: string
  title: string
  content: string
  estimated_fee?: number
  expected_headcount: number
  bookmark_count: number
  views_count: number
  close_at?: string
  created_at?: string
  updated_at?: string
  study_group_id?: number
  lectures?: Array<{
    id: number
    title: string
    instructor?: string
    thumbnail_img_url?: string
    url_link?: string
    original_price?: number
    discount_price?: number
    discounted_price?: number
  }>
  tags?: Array<{
    id: number
    name: string
  }>
  files?: Array<{
    file_name: string
    file_url: string
    id?: number
  }>
  image_urls?: string | string[]
}
