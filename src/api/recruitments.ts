import type {
  Recruitment,
  RecruitmentApiItem,
  RecruitmentApiDetail,
} from '@/types/recruitment'
import {
  mapRecruitmentItem,
  mapRecruitmentDetail,
} from '@/mappers/recruitment/mapper'

export const getRecruitments = async (): Promise<Recruitment[]> => {
  const response = await fetch('/api/v1/recruitments')

  if (!response.ok) {
    throw new Error('공고 목록을 불러오는데 실패했습니다.')
  }

  const data: RecruitmentApiItem[] = await response.json()
  return data.map(mapRecruitmentItem)
}

export const getRecruitmentDetail = async (
  id: string
): Promise<Recruitment> => {
  const response = await fetch(`/api/v1/recruitments/${id}`)

  if (!response.ok) {
    throw new Error('공고를 불러오는데 실패했습니다.')
  }

  const data: RecruitmentApiDetail = await response.json()
  return mapRecruitmentDetail(data)
}

export const incrementRecruitmentViews = async (id: string): Promise<void> => {
  const response = await fetch(`/api/v1/recruitments/${id}/views`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('조회수 증가에 실패했습니다.')
  }
}

export const createRecruitment = async (
  data: Partial<Recruitment>
): Promise<Recruitment> => {
  const response = await fetch('/api/v1/recruitments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('공고 작성에 실패했습니다.')
  }

  return response.json()
}

export const updateRecruitment = async (
  id: string,
  data: Partial<Recruitment>
): Promise<Recruitment> => {
  const response = await fetch(`/api/v1/recruitments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('공고 수정에 실패했습니다.')
  }

  return response.json()
}

export const deleteRecruitment = async (id: string): Promise<void> => {
  const response = await fetch(`/api/v1/recruitments/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('공고 삭제에 실패했습니다.')
  }
}

export interface ApplicationData {
  recruitmentId: string
  content: string
  contact?: string
}

export const postApplication = async (data: ApplicationData): Promise<void> => {
  const response = await fetch('/api/v1/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('지원서 제출에 실패했습니다.')
  }

  return response.json()
}
