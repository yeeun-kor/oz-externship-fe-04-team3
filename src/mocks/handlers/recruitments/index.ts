import { http, HttpResponse } from 'msw'
import { mockRecruitments, filterByCategory } from '@/mocks/recruitmentData'

export const recruitmentHandlers = [
  http.get('/api/recruitments', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''
    const category = url.searchParams.get('category') || '전체 카테고리'
    const sort = url.searchParams.get('sort') || '최신순'

    let result = [...mockRecruitments]

    if (search.trim()) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      )
    }

    result = filterByCategory(category, result)

    switch (sort) {
      case '최신순':
        result.sort((a, b) => {
          const dateA = new Date(
            (a.createdAt || '2025.01.01').replace(/\./g, '-')
          )
          const dateB = new Date(
            (b.createdAt || '2025.01.01').replace(/\./g, '-')
          )
          return dateB.getTime() - dateA.getTime()
        })
        break

      case '조회 많은 순':
        result.sort((a, b) => b.views - a.views)
        break

      case '북마크 많은 순':
        result.sort((a, b) => b.bookmarks - a.bookmarks)
        break
    }

    return HttpResponse.json(result)
  }),

  http.get('/api/recruitments/:id', ({ params }) => {
    const { id } = params
    const recruitment = mockRecruitments.find((r) => r.id === Number(id))

    if (!recruitment) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(recruitment)
  }),
]
