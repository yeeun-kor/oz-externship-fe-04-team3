import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axios'
import type { ApplicantDetail } from '@/components/postings/manage/applicantTypes'

type ApplicantDetailResponse = {
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
  self_introduction: string
  motivation: string
  objective: string
  available_time: string
  has_study_experience: boolean
  study_experience: string
}

const mapApplicantDetail = (res: ApplicantDetailResponse): ApplicantDetail => ({
  id: res.uuid ?? String(res.id),
  name: res.applicant?.nickname ?? '알 수 없음',
  gender: res.applicant?.gender ?? '',
  status: (res.status as any) ?? 'PENDING',
  appliedAt: res.created_at ?? '',
  availableTime: res.available_time ?? '',
  hasExperience: !!res.has_study_experience,
  thumbnail: res.applicant?.profile_img_url ?? undefined,
  selfIntro: res.self_introduction ?? '',
  motivation: res.motivation ?? '',
  goal: res.objective ?? '',
  experienceDetail: res.study_experience ?? '',
})

export const useApplicantDetail = (applicationId?: string) =>
  useQuery({
    queryKey: ['applicant-detail', applicationId],
    enabled: !!applicationId,
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApplicantDetailResponse>(
        `/v1/applications/${applicationId}/review`
      )
      return mapApplicantDetail(data)
    },
    placeholderData: (prev) => prev,
  })
