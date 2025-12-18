import { useState, useMemo } from 'react'
import {
  mockRecruitments,
  filterByCategory,
  type Recruitment,
} from '@/mocks/recruitmentData'

export function useRecruitments() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리')
  const [selectedSort, setSelectedSort] = useState('최신순')
  const [visibleCount, setVisibleCount] = useState(10)

  const filteredAndSorted = useMemo(() => {
    let result: Recruitment[] = [...mockRecruitments]

    if (searchKeyword.trim()) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    }

    result = filterByCategory(selectedCategory, result)

    switch (selectedSort) {
      case '최신순':
        result.sort((a, b) => {
          const dateA = new Date(
            (a.createdAt ?? '2025.01.01').replace(/\./g, '-')
          )
          const dateB = new Date(
            (b.createdAt ?? '2025.01.01').replace(/\./g, '-')
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

    return result
  }, [searchKeyword, selectedCategory, selectedSort])

  const displayedRecruitments = filteredAndSorted.slice(0, visibleCount)
  const hasMore = visibleCount < filteredAndSorted.length

  const recommendedRecruitments = useMemo(() => {
    const sorted = [...mockRecruitments].sort((a, b) => {
      const scoreA = a.views + a.bookmarks * 10
      const scoreB = b.views + b.bookmarks * 10
      return scoreB - scoreA
    })
    return sorted.slice(0, 3)
  }, [])

  return {
    searchKeyword,
    selectedCategory,
    selectedSort,
    displayedRecruitments,
    filteredAndSorted,
    recommendedRecruitments,
    hasMore,
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
