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

// 모드 응답에 공통 에러 로직 처리
axiosInstance.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    const originalRequest = error.config //에러헤더
    const status = error.response?.status //에러응답코드

    // 네트워크 에러 처리
    if (!error.response) {
      showToast.error('네트워크 오류', '네트워크 연결을 확인해주세요.')
      return Promise.reject(error)
    }

    // 401: 토큰 갱신 후 재시도
    if (status === 401) {
      try {
        const access_token = await getAccessTokenApi()
        useAuthStore.getState().setAccessToken(access_token)
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return axiosInstance(originalRequest) //헤더에 토큰 다시 넣어서 재요청
      } catch (error) {
        return Promise.reject(error)
      }
    }
    // 401과 400을 제외한 에러코드
    else if (
      status === 403 ||
      status === 404 ||
      status === 409 ||
      status === 500
    ) {
      showToast.error(`오류`, `${error.response?.data?.error_detail}`)
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)
