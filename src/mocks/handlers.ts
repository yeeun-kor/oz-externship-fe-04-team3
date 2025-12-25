import { http, HttpResponse } from 'msw'
import { bookmarkHandlers } from './handlers/lectures/bookmarkHandlers'
import { lectureHandlers } from './handlers/lectures/lectureHandlers'
import { recruitmentHandlers as myRecruitmentHandlers } from './handlers/myRecruitments'
import { notificationHandlers } from './handlers/notification'
import { recruitmentHandlers } from './handlers/recruitments'
import { recruitmentCreateHandler } from './handlers/recruitments/createRecruitment'
import { applyRecruitmentHandler } from './handlers/recruitments/applyRecruitment'
import { studyGroupHandlers } from './handlers/studyGroups'
import { userInformationHandler } from './handlers/user'
import { uploadsHandlers } from './handlers/uploads'

type User = { id: number; name: string; email: string }

let users: User[] = [
  { id: 1, name: '김오즈', email: 'kim@example.com' },
  { id: 2, name: '이코딩', email: 'lee@example.com' },
]

// mock 사용 여부
const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const handlers = [
  // mock 사용 시에만
  ...(useMock ? userInformationHandler : []),
  ...(useMock ? notificationHandlers : []),
  ...(useMock ? lectureHandlers : []),
  ...(useMock ? myRecruitmentHandlers : []),
  ...(useMock ? recruitmentHandlers : []),
  ...(useMock ? recruitmentCreateHandler : []),
  ...(useMock ? studyGroupHandlers : []),
  ...(useMock ? bookmarkHandlers : []),
  ...(useMock ? uploadsHandlers : []),
  ...(useMock ? applyRecruitmentHandler : []),

  // user API (mock 전용)
  ...(useMock
    ? [
        http.get('/api/users', () => {
          return HttpResponse.json(users)
        }),

        http.get('/api/users/:id', ({ params }) => {
          const user = users.find((u) => u.id === Number(params.id))

          if (!user) {
            return HttpResponse.json(
              { message: '사용자를 찾을 수 없습니다.' },
              { status: 404 }
            )
          }

          return HttpResponse.json(user)
        }),

        http.post('/api/users', async ({ request }) => {
          const body = (await request.json()) as Omit<User, 'id'>
          const newUser: User = {
            id: Date.now(),
            ...body,
          }

          users.push(newUser)

          return HttpResponse.json(newUser, { status: 201 })
        }),

        http.put('/api/users/:id', async ({ params, request }) => {
          const id = Number(params.id)
          const body = (await request.json()) as Partial<User>
          const index = users.findIndex((u) => u.id === id)

          if (index === -1) {
            return HttpResponse.json(
              { message: '수정할 사용자가 없습니다.' },
              { status: 404 }
            )
          }

          users[index] = { ...users[index], ...body }

          return HttpResponse.json(users[index])
        }),

        http.delete('/api/users/:id', ({ params }) => {
          const id = Number(params.id)
          const exists = users.some((u) => u.id === id)

          if (!exists) {
            return HttpResponse.json(
              { message: '삭제할 사용자가 없습니다.' },
              { status: 404 }
            )
          }

          users = users.filter((u) => u.id !== id)

          return HttpResponse.json({ success: true })
        }),
      ]
    : []),
]
