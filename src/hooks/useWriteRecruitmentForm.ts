import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { getStudyGroupDetail, getStudyGroups } from '@/api/studyGroup'
import { getPresignedUrl, uploadToPresigned } from '@/api/uploads'
import { showToast } from '@/components/common/toast/Toast'
import { axiosInstance } from '@/api/axios'
import type { UploadedFile } from '@/components/common/uploader/FileUploader'
import axios from 'axios'

const formatCloseAt = (date: Date) => {
  // 로컬 타임존 기준으로 00:00:00.000 시각을 ISO+오프셋 형태로 생성
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const offsetMin = -new Date().getTimezoneOffset()
  const sign = offsetMin >= 0 ? '+' : '-'
  const pad = (n: number) => String(Math.abs(n)).padStart(2, '0')
  const hhOffset = pad(Math.floor(Math.abs(offsetMin) / 60))
  const mmOffset = pad(Math.abs(offsetMin) % 60)
  return `${yyyy}-${mm}-${dd}T00:00:00.000${sign}${hhOffset}:${mmOffset}`
}

const RecruitmentPayloadSchema = z.object({
  study_group: z.number().int().positive(),
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  expected_headcount: z.number().int().positive(),
  close_at: z.string().min(1),
  estimated_fee: z.number().int().nonnegative(),
  tags: z.array(z.number().int()).optional(),
  image_urls: z.array(z.string().url()).max(5).optional(),
  files: z
    .array(
      z.object({
        file_name: z.string().min(1),
        file_url: z.string().url(),
      })
    )
    .optional(),
})

export function useWriteRecruitmentForm(
  recruitmentId?: string,
  isEditing = false
) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deadline, setDeadline] = useState<Date | undefined>()
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [estimatedFee, setEstimatedFee] = useState('')
  const [imageCount, setImageCount] = useState(0)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [tagIds, setTagIds] = useState<number[]>([])
  const [studyGroupId, setStudyGroupId] = useState<string>('')
  const [expectedHeadcount, setExpectedHeadcount] = useState<string>('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [totalLecturePrice, setTotalLecturePrice] = useState(0)

  const { data: studyGroups = [] } = useQuery({
    queryKey: ['study-groups'],
    queryFn: getStudyGroups,
  })

  const filteredGroups = studyGroups.filter(
    (g) => g.is_leader && g.status !== 'ENDED'
  )

  const groupOptions = filteredGroups.map((g) => ({
    itemValue: String(g.id),
    itemText: g.name,
  }))

  const { data: groupDetail } = useQuery({
    queryKey: ['study-group-detail', studyGroupId],
    queryFn: () => getStudyGroupDetail(studyGroupId),
    enabled: !!studyGroupId,
  })

  const remainingHeadcount = groupDetail
    ? Math.max(0, groupDetail.max_headcount - groupDetail.current_headcount)
    : 0

  // 그룹 강의 비용 합계 계산
  useEffect(() => {
    if (!groupDetail?.lectures?.length) {
      setTotalLecturePrice(0)
      return
    }
    type LecturePrice = {
      discounted_price?: number
      discount_price?: number
      original_price?: number
    }
    const sum = groupDetail.lectures.reduce((acc, lec) => {
      const candidate = lec as LecturePrice
      const price =
        candidate.discounted_price ??
        candidate.discount_price ??
        candidate.original_price ??
        0
      return acc + price
    }, 0)
    setTotalLecturePrice(sum)
  }, [groupDetail])

  const headcountOptions = useMemo(() => {
    if (remainingHeadcount <= 0) return []
    return Array.from({ length: remainingHeadcount }, (_, idx) => {
      const val = idx + 1
      return { itemValue: String(val), itemText: `${val}명` }
    })
  }, [remainingHeadcount])

  const handleDeadlineChange = (next: Date | undefined) => {
    if (next && groupDetail?.end_at) {
      const end = new Date(groupDetail.end_at).getTime()
      const sel = next.getTime()
      if (sel > end) {
        showToast.error(
          '마감일 설정 오류',
          `스터디 종료일(${groupDetail.end_at}) 이후로는 설정할 수 없습니다.`
        )
        return
      }
    }
    setDeadline(next)
  }

  const onUploadImage = async (file: File) => {
    const ext = (file.name.split('.').pop() ?? 'png').toLowerCase()
    const contentType = file.type || 'application/octet-stream'
    const presigned = await getPresignedUrl({
      type: 'RECRUITMENT_IMAGE',
      content_type: contentType,
      file_name: file.name, // 확장자 포함 원본 이름 그대로 전송
      file_ext: ext,
    })
    await uploadToPresigned(presigned.upload_url, file, presigned.headers)
    setImageUrls((prev) => [...prev, presigned.file_url])
    return presigned.file_url
  }

  const onUploadFile = async (file: File) => {
    const ext = (file.name.split('.').pop() ?? 'dat').toLowerCase()
    const contentType = file.type || 'application/octet-stream'
    const presigned = await getPresignedUrl({
      type: 'RECRUITMENT_ATTACHMENT',
      content_type: contentType,
      file_name: file.name, // 확장자 포함 원본 이름 그대로 전송
      file_ext: ext,
    })
    await uploadToPresigned(presigned.upload_url, file, presigned.headers)
    return { previewUrl: presigned.file_url, key: presigned.key }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let estimatedFeeValue = estimatedFee
    if (estimatedFeeValue === '') {
      const fallback = totalLecturePrice > 0 ? totalLecturePrice : 0
      estimatedFeeValue = String(fallback)
      setEstimatedFee(estimatedFeeValue)
    }

    if (
      !studyGroupId ||
      !expectedHeadcount ||
      !deadline ||
      !title ||
      !content ||
      estimatedFeeValue === ''
    ) {
      showToast.warning('입력값 확인', '필수 항목을 모두 입력해주세요.')
      return
    }

    const payload = {
      study_group: Number(studyGroupId),
      title,
      content,
      expected_headcount: Number(expectedHeadcount),
      close_at: formatCloseAt(deadline),
      estimated_fee: Number(estimatedFeeValue),
      tags: tagIds.length ? tagIds : undefined,
      image_urls: imageUrls,
      // TODO: 첨부파일 수정 정책(덮어쓰기 vs 개별 삭제)이 확정되면 로직 보완 필요
      files: uploadedFiles.map((f) => ({
        file_name: f.name, // 확장자 포함 원본 이름
        file_url: f.url, // presigned 응답의 file_url(전체 URL)
      })),
    }

    const parsed = RecruitmentPayloadSchema.safeParse(payload)
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? '입력값을 다시 확인해주세요.'
      showToast.error('검증 실패', message)
      return
    }

    try {
      if (isEditing && recruitmentId) {
        await axiosInstance.patch(
          `/v1/recruitments/${recruitmentId}`,
          parsed.data
        )
        queryClient.invalidateQueries({
          queryKey: ['my-recruitment-detail', recruitmentId],
        })
        showToast.success('공고 수정', '공고가 수정되었습니다.')
      } else {
        await axiosInstance.post('/v1/recruitments', parsed.data)
        showToast.success('공고 등록', '공고가 등록되었습니다.')
      }
      navigate('/manage')
    } catch (err) {
      // 개별 요청에서 에러 메시지 가공
      let message = '요청을 처리할 수 없습니다.'
      if (axios.isAxiosError(err)) {
        const rawDetail =
          err.response?.data?.error_detail ??
          err.response?.data?.detail ??
          err.response?.data
        if (typeof rawDetail === 'string') {
          message = rawDetail
        } else if (rawDetail && typeof rawDetail === 'object') {
          const collected = Object.values(rawDetail)
            .flat()
            .map((v) => String(v))
            .join(' / ')
          message = collected || message
        } else if (err.message) {
          message = err.message
        }
      } else if (err instanceof Error) {
        message = err.message
      }
      showToast.error('공고 등록 실패', message)
    }
  }

  const state = {
    deadline,
    content,
    title,
    estimatedFee,
    imageCount,
    studyGroupId,
    expectedHeadcount,
    uploadedFiles,
    tagIds,
    imageUrls,
  }

  const actions = {
    handleDeadlineChange,
    setContent,
    setTitle,
    setEstimatedFee,
    setImageCount,
    setStudyGroupId,
    setExpectedHeadcount,
    setUploadedFiles,
    setTagIds,
    setImageUrls,
    onUploadImage,
    onUploadFile,
    handleSubmit,
  }

  const options = useMemo(
    () => ({
      groupOptions,
      headcountOptions,
      remainingHeadcount,
      groupDetail,
    }),
    [groupOptions, headcountOptions, remainingHeadcount, groupDetail]
  )

  return { state, actions, options }
}
