import { showToast } from '@/components/common/toast/Toast'
import { API_BASE_URL } from '@/constant/api'
import { useAuthStore } from '@/store/userStore'
import axios from 'axios'
import { getAccessTokenApi } from './userInformation'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// 모든 요청에 공통 헤더(토큰 등) 주입
axiosInstance.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// 모든 응답에 공통 에러 로직 처리
let refreshPromise: Promise<string> | null = null

axiosInstance.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    const originalRequest = error.config
    const status = error.response?.status
    const isRefreshCall = originalRequest?.url?.includes(
      '/v1/accounts/token/refresh'
    )

    // 네트워크 에러 처리
    if (!error.response) {
      showToast.error('네트워크 오류', '네트워크 연결을 확인해주세요.')
      return Promise.reject(error)
    }

    // 401: 토큰 갱신 후 재시도
    if (status === 401) {
      if (isRefreshCall) {
        useAuthStore.getState().clearAuth?.()
        return Promise.reject(error)
      }

      if (originalRequest._retry) {
        useAuthStore.getState().clearAuth?.()
        return Promise.reject(error)
      }

      originalRequest._retry = true
      try {
        if (!refreshPromise) {
          refreshPromise = getAccessTokenApi()
        }
        const accessToken = await refreshPromise
        refreshPromise = null
        useAuthStore.getState().setAccessToken(accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        refreshPromise = null
        useAuthStore.getState().clearAuth?.()
        return Promise.reject(refreshError)
      }
    }

    if (status === 404) {
      return Promise.reject(error)
    }

    // 403, 409, 500만 토스트 표시
    if (status === 403 || status === 409 || status === 500) {
      const errorMessage =
        error.response?.data?.error_detail ??
        '요청 처리 중 오류가 발생했습니다.'

      showToast.error('오류', errorMessage)
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)
