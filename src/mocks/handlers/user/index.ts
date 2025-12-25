import { http, HttpResponse } from 'msw'
import { userInformation } from './mockData'

export const userInformationHandler = [
  http.get('/api/v1/accounts/me', () => {
    return HttpResponse.json(userInformation)
  }),
  http.post('/api/v1/accounts/token/refresh', () => {
    // 토큰 갱신
    return HttpResponse.json({
      access: 'mock-access-token-12345',
    })
  }),
]
