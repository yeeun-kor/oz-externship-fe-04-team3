import axios from 'axios'

export interface ApplicationFormData {
  introduction: string
  motivation: string
  goal: string
  availableTime: string
  hasExperience: boolean
  experienceDescription: string
}

// 공고 상세 조회
export const getRecruitmentDetail = async (id: number) => {
  const response = await axios.get(`/api/recruitments/${id}`)
  return response.data
}

// 신청하기
export const postApplication = async (
  recruitmentId: number,
  data: ApplicationFormData
) => {
  const response = await axios.post(
    `/api/recruitments/${recruitmentId}/apply`,
    data
  )
  return response.data
}
