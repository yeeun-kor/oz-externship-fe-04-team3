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
