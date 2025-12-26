import { useState, useMemo, useEffect } from 'react'
import { getRecruitments } from '@/api/recruitments'
import { mapRecruitmentItem } from '@/mappers/recruitment/mapper'
import type { Recruitment } from '@/types/recruitment'
import type { MyRecruitmentParams } from '@/types/myRecruitment'

export function useRecruitments() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [selectedSort, setSelectedSort] =
    useState<MyRecruitmentParams['sort']>()
  const [visibleCount, setVisibleCount] = useState(10)
  const [recruitments, setRecruitments] = useState<Recruitment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const params: MyRecruitmentParams = {}

        // 검색어가 있으면 추가
        if (searchKeyword.trim()) {
          params.search = searchKeyword
        }

        // 태그가 있으면 추가
        if (selectedTag && selectedTag !== '전체 태그') {
          params.tags = [selectedTag]
        }

        // 정렬 옵션이 있으면 추가
        if (selectedSort) {
          params.sort = selectedSort
        }

        const data = await getRecruitments(params)
        // API 응답이 paginated response 형태인 경우 처리
        const results = data?.results ?? []
        const mappedData = results.map(mapRecruitmentItem)
        setRecruitments(mappedData)
      } catch {
        setRecruitments([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchKeyword, selectedTag, selectedSort])

  const filteredAndSorted = useMemo(() => {
    return recruitments
  }, [recruitments])

  const displayedRecruitments = filteredAndSorted.slice(0, visibleCount)
  const hasMore = visibleCount < filteredAndSorted.length

  const recommendedRecruitments = useMemo(() => {
    const sorted = [...recruitments].sort((a, b) => {
      const scoreA = (a.views ?? 0) + (a.bookmarks ?? 0) * 10
      const scoreB = (b.views ?? 0) + (b.bookmarks ?? 0) * 10
      return scoreB - scoreA
    })
    return sorted.slice(0, 3)
  }, [recruitments])

  return {
    searchKeyword,
    selectedTag,
    selectedSort,
    displayedRecruitments,
    filteredAndSorted,
    recommendedRecruitments,
    hasMore,
    isLoading,
    handleSearchChange: (value: string) => {
      setSearchKeyword(value)
      setVisibleCount(10)
    },
    handleTagChange: (value: string) => {
      setSelectedTag(value)
      setVisibleCount(10)
    },
    handleSortChange: (value: string) => {
      setSelectedSort(value as MyRecruitmentParams['sort'])
      setVisibleCount(10)
    },
    handleLoadMore: () => {
      setVisibleCount((prev) => prev + 10)
    },
  }
}
