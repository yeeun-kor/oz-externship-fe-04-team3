import { axiosInstance } from '@/api/axios'

//accessToken으로 유저 정보 받는 api
export const getUserInformationApi = async () => {
  const { data } = await axiosInstance.get('/v1/accounts/me')
  return data //응답값 유저 정보
}

//리프레쉬토큰값 보내서 액세스토큰값 받아오는api
export const getAccessTokenApi = async () => {
  const { data } = await axiosInstance.post<{ access_token: string }>(
    '/v1/accounts/token/refresh'
  )
  return data.access_token
}

//로그아웃
export const logoutApi = async () => {
  const { data } = await axiosInstance.post<{ access_token: string }>(
    '/v1/accounts/logout'
  )
  return data
}
