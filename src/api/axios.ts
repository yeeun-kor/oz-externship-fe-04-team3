import { API_BASE_URL } from '@/constant/api'
import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 모든 요청에 공통 헤더(토큰 등) 주입
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 스터디 공고 목록 조회
export const getRecruitments = async (params: {
  search?: string
  category?: string
  sort?: string
}) => {
  const queryParams = new URLSearchParams()
  if (params.search) queryParams.append('search', params.search)
  if (params.category) queryParams.append('category', params.category)
  if (params.sort) queryParams.append('sort', params.sort)

  const response = await axiosInstance.get(
    `/api/recruitments?${queryParams.toString()}`
  )
  return response.data
}

// 스터디 공고 상세 조회
export const getRecruitmentDetail = async (id: string) => {
  const response = await axiosInstance.get(`/api/recruitments/${id}`)
  return response.data
}
