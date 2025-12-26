import { getUserRecommendsLecturesApi } from '@/api/lecture'
import { getRecruitmentTags } from '@/api/recruitmentTag'

import { Select } from '@/components/common'
import PublicBanner from '@/components/postings/recruitment/PublicBanner'
import RecommendedSection from '@/components/postings/recruitment/RecommendedSection'
import RecruitmentCard from '@/components/postings/recruitment/RecruitmentCard'
import { useRecruitments } from '@/hooks/recruitment/useRecruitments'
import { queryClient } from '@/main'
import { sortDataRecruitment } from '@/mappers/recruitment/mapper'
import { useAuthStore } from '@/store/userStore'
import { useQuery } from '@tanstack/react-query'
import { ArrowDownWideNarrow, ArrowUp, List, Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RecruitmentListPage() {
  const navigate = useNavigate()
  const { loginState, user } = useAuthStore()
  const isLoggedIn = loginState === 'USER'

  const [showScrollTop, setShowScrollTop] = useState(false)

  const {
    searchKeyword,
    selectedTag,
    selectedSort,
    filteredAndSorted,
    hasMore,
    handleSearchChange,
    handleTagChange,
    handleSortChange,
    handleLoadMore,
  } = useRecruitments()

  // 태그 목록 가져오기
  const { data: tagsData } = useQuery({
    queryKey: ['recruitment-tags'],
    queryFn: () => getRecruitmentTags({ page_size: 100 }),
  })

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleRecruitmentClick = (id: string) => {
    navigate(`/recruitments/${id}`)
  }

  useEffect(() => {
    const prefetchData = async () => {
      await queryClient.prefetchQuery({
        queryKey: ['lecture-recommend'],
        queryFn: () => getUserRecommendsLecturesApi(),
      })
    }
    prefetchData()
  }, [])

  const allTags = tagsData?.results ?? []

  // 랜덤 3개 추천 공고 선택
  const recommendRecruiment = useMemo(() => {
    if (filteredAndSorted.length === 0) return []
    return [...filteredAndSorted].sort(() => Math.random() - 0.5).slice(0, 3)
  }, [filteredAndSorted])
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">스터디 구인 공고</h1>
            <p className="mt-1 text-sm text-gray-600 md:text-base">
              새로운 스터디 팀원을 찾거나 관심있는 스터디에 참여해보세요!
            </p>
          </div>
          {isLoggedIn && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/manage')}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <List className="h-4 w-4" />
                공고 관리
              </button>
              <button
                onClick={() => navigate('/write')}
                className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-500"
              >
                <Plus className="h-4 w-4" />
                공고 작성하기
              </button>
            </div>
          )}
        </div>

        {isLoggedIn && (
          <RecommendedSection
            userName={user?.name ?? '사용자'}
            recommended={recommendRecruiment}
            onClick={handleRecruitmentClick}
          />
        )}

        {!isLoggedIn && <PublicBanner />}

        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <div className="relative mb-4 max-w-md">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="공고 제목으로 검색해보세요"
              value={searchKeyword}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-yellow-400 md:py-3 md:text-base"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:gap-4">
            <div className="flex-1">
              <label className="mb-2 block text-xs text-gray-600 md:text-sm">
                태그
              </label>
              <select
                value={selectedTag}
                onChange={(e) => handleTagChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 md:px-4 md:text-base"
              >
                <option value="">전체 태그</option>
                {allTags.map((tag) => (
                  <option key={tag.id} value={tag.name}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="mb-2 block text-xs text-gray-600 md:text-sm">
                정렬
              </label>
              <Select
                name="sort"
                icon={<ArrowDownWideNarrow />}
                value={selectedSort ?? 'default'}
                data={sortDataRecruitment}
                placeHolder="정렬"
                onValueChange={(value) => {
                  handleSortChange(value === 'default' ? '' : value)
                }}
              />
            </div>
          </div>
        </div>

        <h2 className="mb-4 text-xl font-bold">
          전체 공고 ({filteredAndSorted.length})
        </h2>

        {filteredAndSorted.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            검색 결과가 없습니다.
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredAndSorted.map((item) => (
                <RecruitmentCard
                  key={item.id}
                  recruitment={item}
                  onClick={handleRecruitmentClick}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="rounded-lg border-2 border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="mr-1 inline h-5 w-5" />더 많은 공고 보기
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="fixed right-8 bottom-25 z-50">
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-400 text-white shadow-lg hover:bg-gray-500 md:h-14 md:w-14"
          >
            <ArrowUp className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        )}
      </div>
    </div>
  )
}
