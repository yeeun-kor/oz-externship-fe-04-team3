export type Lecture = {
  id: number
  title: string
  instructor: string
  original_price: number
  discounted_price: number //디폴트가격으로 설정됨
  difficulty: 'EASY' | 'NORMAL' | 'HARD' //난이도,UI설정은 아직 미정
  thumbnail_img_url: string
  average_rating: number
  platform: 'UDEMY' | 'INFLEARN'
  url_link: string
  categories: Category[]
  reviews: Review[]
}

type Category = {
  id: number
  name: string
  created_at: string
  updated_at: string
}

type Review = {
  id: number
  rating: number
  content: string
  created_at: string
}

export type LecturePageResponse = {
  count: number
  next: string | null
  previous: string | null
  results: Lecture[]
}
export type LectureRecommendResponse = Lecture[]

export type BookmarkResponse = {
  next: string | null
  previous: string | null
  results: {
    id: number
    title: string
    instructor: string
    original_price: number
    discounted_price: number
    difficulty: 'EASY' | 'NORMAL' | 'HARD'
    thumbnail_img_url: string
    platform: 'UDEMY' | 'INFLEARN'
    url_link: string
  }[]
}
//요청 params
export interface LecturesParams {
  page?: number
  page_size?: number
  search?: string
  sort?:
    | 'latest'
    | 'oldest'
    | 'low_price'
    | 'high_price'
    | 'high_rating'
    | 'low_rating'
  category?:
    | '개발 · 프로그래밍'
    | 'AI 기술'
    | 'AI 활용(AX)'
    | '게임 개발'
    | '데이터 사이언스'
    | '보안 · 네트워크'
    | '하드웨어'
    | '디자인 · 아트'
    | '기획 · 경영 · 마케팅'
    | '외국어'
    | '업무 생산성'
    | '커리어 · 자기계발'
    | '대학 교육'
  max_count?: number
}
