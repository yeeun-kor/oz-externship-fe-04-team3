import { http, HttpResponse } from 'msw'

export const applyRecruitmentHandler = [
  http.post('/api/v1/recruitments/:id/apply', async ({ params, request }) => {
    const recruitmentId = Number(params.id)
    const body = (await request.json()) as {
      introduction: string
      motivation: string
      goal: string
      availableTime: string
      hasExperience: boolean
      experienceDescription: string
    }

    if (!body.introduction || !body.motivation || !body.goal) {
      return HttpResponse.json(
        { message: '필수 항목을 입력해주세요.' },
        { status: 400 }
      )
    }

    return HttpResponse.json(
      {
        message: '스터디 신청이 완료되었습니다.',
        applicationId: Date.now(),
        recruitmentId,
        ...body,
      },
      { status: 201 }
    )
  }),
]
