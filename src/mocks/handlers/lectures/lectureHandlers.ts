import mockData from '@/mocks/data/lectureList.json'

import type { Lecture, LecturePageResponse } from '@/types/lecture'
import { http, HttpResponse } from 'msw'
const generateMockData = () => {
  const base = mockData.results as Lecture[]
  const multiplied: Lecture[] = []

  //데이터 복제
  for (let i = 0; i < 5; i++) {
    base.forEach((lecture) => {
      multiplied.push({
        ...lecture,
        id: lecture.id + i * 1000,
        title: `${lecture.title} (${i + 1})`,
      })
    })
  }

  return multiplied
}
const allLectures = generateMockData()

export const lectureHandlers = [
  http.get('/api/v1/lectures', async ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const page_size = parseInt(url.searchParams.get('page_size') || '12')
    const search = url.searchParams.get('search')
    const sort = url.searchParams.get('sort')
    const category = url.searchParams.get('category')
    let filtered = [...allLectures]

    // 1. 검색 필드
    if (search) {
      filtered = filtered.filter(
        (lecture) =>
          lecture.title.includes(search) || lecture.instructor.includes(search)
      )
    }

    // 2. 카테고리 필터 (파라미터 있을 때만)
    if (category) {
      filtered = filtered.filter((lecture) =>
        lecture.categories.some((i) => i.name === category)
      )
    }

    // 3. 정렬 (선택이 된 데이터를 원본으로 설정했기 떄문에, 역주행으로 갈 경우에는 , 이미 변동이 된 원본을 보여주는 것 뿐.... )
    if (sort) {
      filtered = [...filtered].sort((a, b) => {
        switch (sort) {
          case 'latest':
            return b.id - a.id
          case 'oldest':
            return a.id - b.id
          case 'low_price':
            return a.discounted_price - b.discounted_price
          case 'high_price':
            return b.discounted_price - a.discounted_price
          case 'high_rating':
            return b.average_rating - a.average_rating
          case 'low_rating':
            return a.average_rating - b.average_rating
          default:
            return 0
        }
      })
    }

    const startIndex = (page - 1) * page_size
    const endIndex = startIndex + page_size
    const paginatedLectures = filtered.slice(startIndex, endIndex)

    const response: LecturePageResponse = {
      count: filtered.length,
      next:
        endIndex < filtered.length
          ? `/api/v1/lectures?page=${page + 1}&page_size=${page_size}`
          : null,
      previous:
        page > 1
          ? `/api/v1/lectures?page=${page - 1}&page_size=${page_size}`
          : null,
      results: paginatedLectures,
    }

    return HttpResponse.json(response)
  }),

  http.get('/api/v1/lectures/recommends', async ({ request }) => {
    const url = new URL(request.url)
    const maxCountParam = url.searchParams.get('max_count')
    const maxCount = Math.min(
      Math.max(parseInt(maxCountParam || '3'), 1), // 최소 1
      10 // 최대 10
    )

    // 랜덤 추천 로직 (실제로는 사용자 관심사 기반)
    const highRatedLectures = [...allLectures]

    // 2. 랜덤 셔플
    const shuffled = highRatedLectures.sort(() => Math.random() - 0.5)

    // 3. max_count만큼 선택
    const recommended = shuffled.slice(0, maxCount)

    const response: LecturePageResponse = {
      count: recommended.length,
      next: null,
      previous: null,
      results: recommended,
    }

    return HttpResponse.json(response)
  }),
]
