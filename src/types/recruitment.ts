import { z } from 'zod'

export const applicationSchema = z.object({
  introduction: z
    .string()
    .min(1, '자기소개를 입력해주세요')
    .max(500, '500자 이내로 작성해주세요'),
  motivation: z
    .string()
    .min(1, '지원 동기를 입력해주세요')
    .max(500, '500자 이내로 작성해주세요'),
  goal: z
    .string()
    .min(1, '스터디 목표를 입력해주세요')
    .max(500, '500자 이내로 작성해주세요'),
  availableTime: z
    .string()
    .min(1, '가능한 시간대를 입력해주세요')
    .max(500, '500자 이내로 작성해주세요'),
  hasExperience: z.boolean(),
  experienceDescription: z.string().max(500, '500자 이내로 작성해주세요'),
})

export type ApplicationFormData = z.infer<typeof applicationSchema>
