import { getLecturesApi, getUserRecommendsLecturesApi } from '@/api/lecture'
import { Select } from '@/components/common'
import GuestRecommendSection from '@/components/common/GuestRecommendSection'
import Loading from '@/components/common/Loading'
import { Input } from '@/components/input'
import LectureList from '@/components/lecture/LectureList'
import LectureRecommendSection from '@/components/lecture/LectureRecommendSection'
import NoSearchResult from '@/components/notFound/NoSearchResult'
import useInfiniteScroll from '@/hooks/quries/useInfiniteScroll'
import useDebounce from '@/hooks/useDebounce'
import { categoryData, sortData } from '@/mappers/lectures/lecture'
import { useAuthStore } from '@/store/userStore'
import type { LecturesParams } from '@/types/lecture'
import { useQuery } from '@tanstack/react-query'
import { ArrowDownWideNarrow, Folder, Search } from 'lucide-react'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'

export default function Courses() {
  //검색어 입력
  const [inputValue, setInputValue] = useState('')
  const [category, setCategory] = useState<
    LecturesParams['category'] | undefined
  >()
  const [sort, setSort] = useState<LecturesParams['sort'] | undefined>()
  //useDebounce 적용
  const debouncedInputValue = useDebounce(inputValue)
  //무한쿼리 불러오기
  const {
    data: lectureData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: lectureLoading,
  } = useInfiniteScroll({
    queryKey: ['lectures', debouncedInputValue, category, sort],
    queryFn: (page) =>
      getLecturesApi({
        page,
        search: debouncedInputValue,
        category, // 이미 undefined면 그대로
        sort,
      }),
  })

  // 추천 강의 불러오기
  const { data, isLoading } = useQuery({
    queryKey: ['lecture-recommend'],
    queryFn: () => getUserRecommendsLecturesApi(),
  })

  // 검색어 결과값 있는지 확인
  const hasNoResult = lectureData?.pages.every(
    (page) => page.results.length === 0
  )
  //무한스크롤
  const { ref } = useInView({
    threshold: 0,
    rootMargin: '50px',
    onChange(inView) {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  /* 유저 상태 */
  const { loginState } = useAuthStore()

  return (
    <div className="page_courses flex flex-col gap-6">
      <section className="courses_header">
        <div className="courses_section_header pb-8">
          <h2 className="pb-2">IT 강의 목록</h2>
          <p className="text-gray-600">
            전문 강사들의 고품질 IT 강의를 만나보세요
          </p>
        </div>
        {loginState === 'USER' ? (
          <LectureRecommendSection data={data} isLoading={isLoading} />
        ) : (
          <GuestRecommendSection
            title="강의를"
            description="로그인하시면 관심 분야를 바탕으로 맞춤형 강의"
          />
        )}
      </section>
      <section className="courses_filter flex flex-col items-center gap-2 rounded-md border border-gray-200 bg-white p-6 sm:flex-row">
        <Input
          prefix={<Search />}
          className="h-[38px]"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Select
          icon={<Folder />}
          name="category"
          value={category ?? 'default'}
          data={categoryData}
          placeHolder="카테고리"
          onValueChange={(value) => {
            setCategory(
              value === 'default'
                ? undefined
                : (value as LecturesParams['category'])
            )
          }}
        />
        <Select
          name="sort"
          icon={<ArrowDownWideNarrow />}
          value={sort ?? 'default'}
          data={sortData}
          placeHolder="정렬"
          onValueChange={(value) => {
            setSort(
              value === 'default'
                ? undefined
                : (value as LecturesParams['sort'])
            )
          }}
        />
      </section>
      {lectureLoading ? (
        <Loading />
      ) : (
        <section className="courses_cardlist">
          {/* 검색결과 없으면 NoSearchResult */}
          {hasNoResult ? (
            <NoSearchResult searchResult={debouncedInputValue} />
          ) : (
            <LectureList data={lectureData} />
          )}
        </section>
      )}
      {!hasNoResult && !hasNextPage && (
        <div className="flex-center mt-12 h-12 rounded-md bg-gray-400 text-center text-white">
          더 이상 강의가 없습니다.
        </div>
      )}
      {!hasNoResult && hasNextPage && <div ref={ref} />}
    </div>
  )
}
