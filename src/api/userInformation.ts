import { axiosInstance } from '@/api/axios'
import type { UserInformation } from '@/types/userInformation'

//accessToken으로 유저 정보 받는 api
export const getUserInformationApi = async (): Promise<UserInformation> => {
  const { data } = await axiosInstance.get('/v1/accounts/me')
  return data //응답값 유저 정보
}

//리프레쉬토큰값 보내서 액세스토큰값 받아오는api
export const getAccessTokenApi = async (): Promise<string> => {
  const { data } = await axiosInstance.post<{ accessToken: string }>(
    '/v1/accounts/token/refresh'
  )
  return data.accessToken
}
