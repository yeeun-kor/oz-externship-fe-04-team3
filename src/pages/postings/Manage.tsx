import ManageDashboard from '@/components/postings/manage/ManageDashboard'
import ManageHeader from '@/components/postings/manage/ManageHeader'
import ManageList from '@/components/postings/manage/ManageList'
import ManageSearch from '@/components/postings/manage/ManageSearch'
import ManageCardSkeleton from '@/components/postings/manage/ManageCardSkeleton'
import { useState, useEffect } from 'react'
import type { MyRecruitmentParams } from '@/types/myRecruitment'
import { useMyRecruitments } from '@/hooks/quries/useMyRecruitments'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router'

export default function Manage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'all' | 'open' | 'closed'>('all')
  const [sort, setSort] = useState<MyRecruitmentParams['sort']>('latest')

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    totalCount,
    openCount,
    closedCount,
    isLoading,
    error,
    refetch,
  } = useMyRecruitments({
    page_size: 10,
    sort,
    is_closed:
      status === 'all' ? undefined : status === 'closed' ? true : false,
  })
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '50px',
  })

  // 페이지 진입 시 스크롤 최상단으로 이동
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    if (!inView || !hasNextPage || isFetchingNextPage) return
    fetchNextPage()
    // isFetchingNextPage를 의존성에서 제외해, sentinel이 뷰포트에 머물러도 연속 호출을 막습니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasNextPage, fetchNextPage])

  return (
    <div className="mx-auto flex flex-col gap-6 px-4 py-6">
      <ManageHeader
        onClickWrite={() => navigate('/write')}
        onClickBack={() => navigate(-1)}
      />
      <ManageDashboard
        totalCount={totalCount}
        openCount={openCount}
        closedCount={closedCount}
      />
      <ManageSearch
        status={status}
        sort={sort}
        counts={{ total: totalCount, open: openCount, closed: closedCount }}
        onStatusChange={(value) => setStatus(value)}
        onSortChange={(value) => setSort(value)}
      />
      {isLoading && <ManageList postings={[]} isLoading />}
      {error && (
        <div className="border-danger-500 bg-danger rounded-lg border p-6 text-sm text-gray-800">
          공고 목록을 불러오지 못했습니다.
        </div>
      )}
      {!isLoading && !error && (
        <>
          <ManageList postings={data} onDeleted={() => refetch()} />
          {isFetchingNextPage && <ManageCardSkeleton count={6} />}
          {!hasNextPage ? (
            <div className="flex-center mt-12 h-12 rounded-md bg-gray-400 text-center text-white">
              더 이상 공고가 없습니다.
            </div>
          ) : (
            <div
              className="bg-primary-500 flex-center mt-12 h-12 cursor-pointer rounded-md text-center text-white"
              ref={!isFetchingNextPage ? ref : undefined}
              onClick={() => {
                if (!isFetchingNextPage) fetchNextPage()
              }}
            >
              {isFetchingNextPage ? '불러오는 중...' : '더 많은 공고 보기'}
            </div>
          )}
        </>
      )}
    </div>
  )
}
