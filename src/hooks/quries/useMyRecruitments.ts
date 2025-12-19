import getMyRecruitmentListApi from '@/api/myRecruitment'
import { mapRecruitment } from '@/mappers/myRecruitment/mapper'
import type {
  MyRecruitmentParams,
  MyRecruitmentPageResponse,
} from '@/types/myRecruitment'
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'

const CACHE_STALE_TIME = 1000 * 60 * 5 // 5분 동안 신선한 데이터로 간주
const CACHE_GC_TIME = 1000 * 60 * 15 // 15분 후 가비지 컬렉션

export const useMyRecruitments = ({
  page = 1,
  page_size = 10,
  search,
  sort,
  tags,
  is_closed,
}: MyRecruitmentParams = {}) => {
  // 1) 모집중 카운트용 (is_closed=false)
  const openCountQuery = useQuery<number>({
    queryKey: ['manageRecruitmentList-open-count'],
    queryFn: async () => {
      const data = await getMyRecruitmentListApi({
        is_closed: false,
      })
      return data?.count ?? 0
    },
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_GC_TIME,
  })

  // 2) 마감 카운트용 (is_closed=true)
  const closedCountQuery = useQuery<number>({
    queryKey: ['manageRecruitmentList-closed-count'],
    queryFn: async () => {
      const data = await getMyRecruitmentListApi({
        is_closed: true,
      })
      return data?.count ?? 0
    },
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_GC_TIME,
  })

  // 3) 리스트용 무한스크롤
  const listQuery = useInfiniteQuery<MyRecruitmentPageResponse>({
    queryKey: [
      'manageRecruitmentList',
      { page_size, search, sort, tags, is_closed },
    ],
    queryFn: async ({ pageParam }) => {
      return getMyRecruitmentListApi({
        page: pageParam as number,
        page_size,
        search,
        sort,
        tags,
        is_closed,
      })
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    initialPageParam: page,
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_GC_TIME,
    placeholderData: keepPreviousData,
    enabled:
      openCountQuery.status !== 'error' && closedCountQuery.status !== 'error',
  })

  return {
    data:
      listQuery.data?.pages.flatMap((p) =>
        (p.results ?? []).map(mapRecruitment)
      ) ?? [],
    hasNextPage: listQuery.hasNextPage,
    fetchNextPage: listQuery.fetchNextPage,
    isFetchingNextPage: listQuery.isFetchingNextPage,
    totalCount: (openCountQuery.data ?? 0) + (closedCountQuery.data ?? 0),
    openCount: openCountQuery.data ?? 0,
    closedCount: closedCountQuery.data ?? 0,
    isLoading:
      listQuery.isLoading ||
      openCountQuery.isLoading ||
      closedCountQuery.isLoading,
    error: listQuery.error || openCountQuery.error || closedCountQuery.error,
    refetch: listQuery.refetch,
  }
}
