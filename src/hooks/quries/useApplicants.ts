import { useInfiniteQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axios'
import type { Applicant } from '@/components/postings/manage/applicantTypes'

type ApplicantApiItem = {
  id: number
  uuid: string
  status: string
  created_at: string
  updated_at: string
  applicant: {
    id: number
    nickname: string
    gender: string
    profile_img_url: string | null
  }
  available_time: string
  has_study_experience: boolean
}

type ApplicantListResponse = {
  next: string | null
  previous: string | null
  results: ApplicantApiItem[]
}

const mapApplicant = (item: ApplicantApiItem): Applicant => ({
  // 백엔드 상세 조회는 application id 기반이라 id를 우선 사용
  id: String(item.id),
  name: item.applicant?.nickname ?? '알 수 없음',
  gender: item.applicant?.gender ?? '',
  status: (item.status as any) ?? 'PENDING',
  appliedAt: item.created_at ?? '',
  availableTime: item.available_time ?? '',
  hasExperience: !!item.has_study_experience,
  thumbnail: item.applicant?.profile_img_url ?? undefined,
})

export const useApplicants = (
  recruitmentUuid?: string,
  pageSize = 10,
  enabled = true
) =>
  useInfiniteQuery({
    queryKey: ['applicants', recruitmentUuid],
    queryFn: async ({ pageParam }) => {
      const { data } = await axiosInstance.get<ApplicantListResponse>(
        pageParam || `/v1/recruitments/${recruitmentUuid}/applicants`,
        {
          params: pageParam ? undefined : { page_size: pageSize },
        }
      )
      return data
    },
    enabled: !!recruitmentUuid && enabled,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    placeholderData: (prev) => prev,
    select: (data) => ({
      pageParams: data.pageParams,
      pages: data.pages.map((page) => ({
        ...page,
        results: page.results.map(mapApplicant),
      })),
    }),
  })
