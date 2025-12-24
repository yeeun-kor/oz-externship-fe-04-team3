import { useState, useMemo, useEffect } from 'react'
import { getRecruitments } from '@/api/recruitments'
import type { Recruitment } from '@/types/recruitment'

export function useRecruitments() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리')
  const [selectedSort, setSelectedSort] = useState('최신순')
  const [visibleCount, setVisibleCount] = useState(10)
  const [recruitments, setRecruitments] = useState<Recruitment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getRecruitments()
        setRecruitments(data)
      } catch {
        setRecruitments([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

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
    selectedCategory,
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
    handleCategoryChange: (value: string) => {
      setSelectedCategory(value)
      setVisibleCount(10)
    },
    handleSortChange: (value: string) => {
      setSelectedSort(value)
      setVisibleCount(10)
    },
    handleLoadMore: () => {
      setVisibleCount((prev) => prev + 10)
    },
  }
}
