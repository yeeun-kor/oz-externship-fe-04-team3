import { http, HttpResponse } from 'msw'
import recruitmentData from '../../data/recruitmentList.json'

interface Recruitment {
  uuid: string
  title: string
  thumbnail_img_url: string
  expected_headcount: number
  close_at: string
  views_count: number
  bookmark_count: number
  lectures: Array<{
    id: number
    title: string
    instructor: string
  }>
  tags: Array<{
    id: number
    name: string
  }>
}

interface RecruitmentResponse {
  count: number
  next: string | null
  previous: string | null
  results: Recruitment[]
}

const recruitmentStore = {
  list: [...recruitmentData.results],
}

export const recruitmentHandlers = [
  http.get('/api/v1/recruitments/mine', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('page_size') || '10')
    const search = url.searchParams.get('search') || ''
    const sort = url.searchParams.get('sort') || 'latest'
    const tagsParam = url.searchParams.getAll('tags')

    let results = [...recruitmentStore.list]

    // 검색 필터
    if (search) {
      results = results.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      )
    }

    // 태그 필터
    if (tagsParam.length > 0) {
      results = results.filter((item) =>
        item.tags.some((tag) => tagsParam.includes(tag.name))
      )
    }

    const sortRecruitments = (
      list: Recruitment[],
      sortKey: RecruitmentSortKey
    ) => {
      const sorted = [...list]
      switch (sortKey) {
        case 'latest':
          return sorted.sort(
            (a, b) =>
              new Date(b.close_at).getTime() - new Date(a.close_at).getTime()
          )
        case 'oldest':
          return sorted.sort(
            (a, b) =>
              new Date(a.close_at).getTime() - new Date(b.close_at).getTime()
          )
        case 'most_views':
          return sorted.sort((a, b) => b.views_count - a.views_count)
        case 'most_bookmarks':
          return sorted.sort((a, b) => b.bookmark_count - a.bookmark_count)
        default:
          return sorted
      }
    }

    type RecruitmentSortKey =
      | 'latest'
      | 'oldest'
      | 'most_views'
      | 'most_bookmarks'

    results = sortRecruitments(
      results,
      (sort as RecruitmentSortKey | undefined) ?? 'latest'
    )

    const isClosedParam = url.searchParams.get('is_closed')
    const filterClosed =
      isClosedParam === null ? undefined : isClosedParam === 'true'

    // close_at 기준으로 마감 여부 계산
    const now = Date.now()
    const withClosedFlag = results.map((item) => ({
      ...item,
      is_closed: new Date(item.close_at).getTime() <= now,
    }))

    let filtered = withClosedFlag

    // is_closed 필터 적용
    if (typeof filterClosed === 'boolean') {
      filtered = filtered.filter((item) => item.is_closed === filterClosed)
    }

    // 페이지네이션
    const totalCount = filtered.length
    const startIdx = (page - 1) * pageSize
    const endIdx = startIdx + pageSize
    const paginatedResults = filtered.slice(startIdx, endIdx)

    // next/previous URL 생성
    const baseUrl = new URL(request.url).origin + '/api/v1/recruitments/mine?'
    const searchParams = new URLSearchParams({
      page_size: pageSize.toString(),
      ...(search && { search }),
      ...(sort !== 'latest' && { sort }),
    })
    tagsParam.forEach((tag) => searchParams.append('tags', tag))

    const nextPage = endIdx < totalCount ? page + 1 : null
    const previousPage = page > 1 ? page - 1 : null
    const buildPageUrl = (pageNum: number) =>
      `${baseUrl}page=${pageNum}&${searchParams.toString()}`

    const response: RecruitmentResponse = {
      count: totalCount,
      next: nextPage ? buildPageUrl(nextPage) : null,
      previous: previousPage ? buildPageUrl(previousPage) : null,
      results: paginatedResults,
    }

    return HttpResponse.json(response)
  }),
  http.get('/api/v1/recruitments/:id', ({ params }) => {
    const id = params.id as string
    const target = recruitmentStore.list.find((item) => item.uuid === id)
    if (!target) {
      return HttpResponse.json(
        { error_detail: '해당 공고를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    return HttpResponse.json({
      ...target,
      content: `${target.title} 내용입니다.\n상세 설명을 작성하세요.`,
      estimated_fee: 0,
      image_urls: [],
    })
  }),
  http.delete('/api/v1/recruitments/:id', ({ params }) => {
    const id = params.id as string
    const before = recruitmentStore.list.length
    recruitmentStore.list = recruitmentStore.list.filter(
      (item) => item.uuid !== id
    )
    if (recruitmentStore.list.length === before) {
      return HttpResponse.json(
        { error_detail: '해당 공고를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    return HttpResponse.json({ detail: '삭제되었습니다.' })
  }),
]
