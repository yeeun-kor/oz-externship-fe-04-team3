import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getStudyGroupDetail, getStudyGroups } from '@/api/studyGroup'
import { getPresignedUrl } from '@/api/uploads'
import { showToast } from '@/components/common/toast/Toast'
import { axiosInstance } from '@/api/axios'
import type { UploadedFile } from '@/components/common/uploader/FileUploader'

const formatCloseAt = (date: Date) => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} 00:00:00`
}

const RecruitmentPayloadSchema = z.object({
  study_group: z.number().int().positive(),
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  expected_headcount: z.number().int().positive(),
  close_at: z.string().min(1),
  estimated_fee: z.number().int().optional(),
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

export function useWriteRecruitmentForm() {
  const navigate = useNavigate()
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
    const ext = file.name.split('.').pop() ?? 'png'
    const presigned = await getPresignedUrl({
      type: 'RECRUITMENT_IMAGE',
      content_type: file.type,
      file_name: file.name.replace(`.${ext}`, ''),
      file_ext: ext,
    })
    // TODO: presigned.upload_url로 실제 이미지를 PUT 전송한 뒤 성공 시 file_url을 사용하도록 연동 필요
    setImageUrls((prev) => [...prev, presigned.file_url])
    return presigned.file_url
  }

  const onUploadFile = async (file: File) => {
    const ext = file.name.split('.').pop() ?? 'dat'
    const presigned = await getPresignedUrl({
      type: 'RECRUITMENT_ATTACHMENT',
      content_type: file.type || 'application/octet-stream',
      file_name: file.name.replace(`.${ext}`, ''),
      file_ext: ext,
    })
    // TODO: presigned.upload_url로 실제 파일을 PUT 업로드하도록 백엔드 연동 필요
    return presigned.file_url
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (
      !studyGroupId ||
      !expectedHeadcount ||
      !deadline ||
      !title ||
      !content
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
      estimated_fee: estimatedFee ? Number(estimatedFee) : undefined,
      tags: tagIds.length ? tagIds : undefined,
      image_urls: imageUrls,
      files: uploadedFiles.map((f) => ({
        file_name: f.name,
        file_url: f.url,
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
      await axiosInstance.post('/v1/recruitments', parsed.data)
      showToast.success('공고 등록', '공고가 등록되었습니다.')
      navigate('/manage')
    } catch (err) {
      showToast.error('공고 등록 실패', (err as Error)?.message ?? '')
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
