import { Button, Select } from '@/components/common'
import { DashedBox } from '@/components/common/DashedBox'
import { DatePickerInput } from '@/components/common/date-picker/DatePickerInput'
import { MarkdownEditor } from '@/components/common/markdown'
import { Input } from '@/components/input'
import { Plus, X } from 'lucide-react'
import TagSvg from '@/assets/icons/Tag.svg'
import { FileUploader } from '@/components/common/uploader/FileUploader'
import { useWriteRecruitmentForm } from '@/hooks/useWriteRecruitmentForm'
import { TagSelectModal, type TagOption } from './TagSelectModal'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getRecruitmentDetail } from '@/api/recruitments'
import { getLecturesApi } from '@/api/lecture'

type WriteFormHook = ReturnType<typeof useWriteRecruitmentForm>

type SectionProps = {
  state: WriteFormHook['state']
  actions: WriteFormHook['actions']
  options: WriteFormHook['options']
}

type BasicInfoProps = SectionProps & {
  lectures: { id: number; title: string; price: number }[]
  lecturesLoading: boolean
  totalLecturePrice: number
}

type ExtraInfoProps = {
  state: WriteFormHook['state']
  actions: WriteFormHook['actions']
  selectedTags: TagOption[]
  setSelectedTags: Dispatch<SetStateAction<TagOption[]>>
}

function BasicInfoSection({
  state,
  actions,
  options,
  lectures,
  lecturesLoading,
  totalLecturePrice,
}: BasicInfoProps) {
  const { title, studyGroupId, expectedHeadcount, deadline } = state
  const {
    setTitle,
    setStudyGroupId,
    setExpectedHeadcount,
    handleDeadlineChange,
  } = actions
  const { groupOptions, headcountOptions, remainingHeadcount } = options

  return (
    <section className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-8">
      <h3 className="text-xl">기본정보</h3>
      <div>
        <Input
          className=""
          label="공고 제목"
          required
          name="title"
          placeholder="예: React 스터디 함께하실 분을 찾습니다!"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <Select
          name="대상 스터디 그룹"
          title="대상 스터디 그룹"
          placeHolder="스터디 그룹을 선택해주세요"
          required
          data={groupOptions}
          value={studyGroupId}
          onValueChange={(val) => {
            setStudyGroupId(val)
            setExpectedHeadcount('')
          }}
        />
        {lectures.length > 0 && (
          <div className="mt-3 space-y-2 rounded-lg bg-[#FEFCE8] p-3">
            <p className="text-sm font-medium text-[#854D0E]">
              선택된 그룹의 강의 정보
            </p>
            <div className="space-y-1 text-sm text-[#A16207]">
              {lectures.map((lec) => (
                <div key={lec.id} className="flex-between">
                  <span>{lec.title}</span>
                  <span>
                    {lec.price > 0
                      ? `${lec.price.toLocaleString()}원`
                      : '가격 정보 없음'}
                  </span>
                </div>
              ))}
              {lecturesLoading && (
                <div className="text-xs text-orange-600">
                  강의 가격 불러오는 중...
                </div>
              )}
              <div className="flex-between mt-2 border-t border-orange-200 pt-2 text-sm font-medium">
                <span>총 강의 비용</span>
                <span>
                  {totalLecturePrice > 0
                    ? `${totalLecturePrice.toLocaleString()}원`
                    : '정보 없음'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-between flex-col gap-4 md:flex-row">
        <div className="w-full">
          <DatePickerInput
            label="공고 마감 기한"
            value={deadline}
            onChange={handleDeadlineChange}
            required
          />
        </div>
        <div className="w-full">
          <Select
            name="예상 모집 인원"
            title="예상 모집 인원"
            placeHolder={
              studyGroupId
                ? remainingHeadcount > 0
                  ? '모집 인원을 선택해주세요'
                  : '모집 가능한 인원이 없습니다'
                : '스터디 그룹을 먼저 선택해주세요'
            }
            required
            data={headcountOptions}
            value={expectedHeadcount}
            disabled={!studyGroupId || headcountOptions.length === 0}
            onValueChange={setExpectedHeadcount}
          />
        </div>
      </div>
    </section>
  )
}

function ContentSection({
  state,
  actions,
}: Pick<SectionProps, 'state' | 'actions'>) {
  const { content, imageCount } = state
  const { setContent, setImageCount, onUploadImage } = actions

  return (
    <section className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-8">
      <h3 className="text-xl">공고내용</h3>
      <div>
        <p className="mb-2 text-sm text-gray-700">
          스터디 그룹 소개 <span className="ml-1 text-red-500">*</span>
        </p>
        <p className="flex-between mb-2 gap-4 text-sm text-gray-500">
          <span>마크다운 문법을 사용할 수 있습니다</span>
          <span>이미지 {imageCount}/5개</span>
        </p>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          onImageCountChange={setImageCount}
          allowImageDrop
          onUploadImage={onUploadImage}
        />
      </div>
    </section>
  )
}

function ExtraInfoSection({
  state,
  actions,
  selectedTags,
  setSelectedTags,
  isTagModalOpen,
  onOpenTagModal,
}: ExtraInfoProps & {
  isTagModalOpen: boolean
  onOpenTagModal: (open: boolean) => void
}) {
  const { estimatedFee, uploadedFiles } = state
  const { setEstimatedFee, setUploadedFiles, onUploadFile, setTagIds } = actions

  useEffect(() => {
    setTagIds(selectedTags.map((tag) => Number(tag.id)))
  }, [selectedTags, setTagIds])

  return (
    <section className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-8">
      <h3 className="text-xl">추가정보</h3>
      <div>
        <Input
          className=""
          label="예상 결제 비용"
          placeholder="미입력시 강의 비용 자동 계산"
          name="estimated_fee"
          value={estimatedFee}
          onChange={(e) => setEstimatedFee(e.target.value)}
        />
      </div>
      <div>
        <p className="flex-between mb-2 text-sm text-gray-700">
          사용자 정의 태그
          <Button
            variant={'primary'}
            type="button"
            onClick={() => onOpenTagModal(true)}
          >
            <Plus className="h-6 w-6" />
            태그 추가
          </Button>
        </p>
        <DashedBox
          className={`p-6 ${
            selectedTags.length > 0
              ? 'border border-gray-200 bg-gray-50'
              : 'min-h-[106px]'
          }`}
          color={
            selectedTags.length > 0
              ? 'var(--color-gray-200)'
              : 'var(--color-gray-300)'
          }
          borderRadius={8}
          borderWidth={selectedTags.length > 0 ? 1 : 2}
          dashLength={selectedTags.length > 0 ? 0 : 4}
          dashGap={selectedTags.length > 0 ? 0 : 4}
        >
          {selectedTags.length === 0 ? (
            <p className="flex-center absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 flex-col text-sm text-[#6B7280]">
              <img src={TagSvg} alt="tag" />
              <span>선택된 태그가 없습니다</span>
              <span className="text-[12px]">
                태그 검색 버튼을 클릭해서 태그를 추가해보세요
              </span>
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-primary-50 text-primary-700 flex items-center gap-2 rounded-full px-3 py-1 text-sm"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedTags((prev) =>
                        prev.filter((item) => item.id !== tag.id)
                      )
                    }
                    className="text-primary-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </DashedBox>
        <span className="text-sm text-gray-700">
          태그는 최대 5개까지 선택할 수 있습니다 ({selectedTags.length}/5)
        </span>
      </div>

      <div>
        <p className="mb-2 text-sm text-gray-700">
          참고 파일 업로드 (선택사항)
        </p>
        <FileUploader
          files={uploadedFiles}
          onChange={setUploadedFiles}
          maxCount={3}
          maxSize={5 * 1024 * 1024}
          onUploadFile={onUploadFile}
        />
      </div>
      <TagSelectModal
        open={isTagModalOpen}
        onOpenChange={onOpenTagModal}
        initialSelected={selectedTags}
        onConfirm={(tags) => setSelectedTags(tags)}
      />
    </section>
  )
}

export default function WriteForm() {
  const { state, actions, options } = useWriteRecruitmentForm()
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([])
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [searchParams] = useSearchParams()
  const recruitmentId = searchParams.get('recruitmentId')
  const {
    setTitle,
    setContent,
    setEstimatedFee,
    setExpectedHeadcount,
    setTagIds,
    handleDeadlineChange,
  } = actions
  const lecturesFromGroup = options.groupDetail?.lectures ?? []

  const { data: lectureDetails = [], isLoading: lecturesLoading } = useQuery({
    queryKey: ['group-lecture-details', lecturesFromGroup.map((l) => l.id)],
    queryFn: async () => {
      const results = await Promise.all(
        lecturesFromGroup.map(async (lec) => {
          const searchResult = await getLecturesApi({
            search: lec.title,
            page_size: 1,
          })
          return searchResult.results[0]
        })
      )
      return results.filter(Boolean)
    },
    enabled: lecturesFromGroup.length > 0,
  })

  const { data: detail } = useQuery<
    | {
        title: string
        content: string
        estimated_fee?: number
        expected_headcount: number
        close_at: string
        tags: { id: number; name: string }[]
        image_urls?: string[]
      }
    | undefined
  >({
    queryKey: ['my-recruitment-detail', recruitmentId],
    queryFn: async () => {
      if (!recruitmentId) return undefined
      return getRecruitmentDetail(recruitmentId)
    },
    enabled: !!recruitmentId,
  })

  const formattedLectures = lectureDetails.map((lec) => ({
    id: lec.id,
    title: lec.title,
    price: lec.discounted_price ?? lec.original_price ?? 0,
  }))
  const totalLecturePrice = formattedLectures.reduce(
    (sum, lec) => sum + (lec.price || 0),
    0
  )

  useEffect(() => {
    if (!detail || initialized) return
    setTitle(detail.title)
    setContent(detail.content)
    setEstimatedFee(detail.estimated_fee ? String(detail.estimated_fee) : '')
    setExpectedHeadcount(
      detail.expected_headcount ? String(detail.expected_headcount) : ''
    )
    setTagIds(detail.tags?.map((t) => t.id) ?? [])
    setSelectedTags(
      detail.tags?.map((t) => ({ id: String(t.id), name: t.name })) ?? []
    )
    if (detail.close_at) {
      handleDeadlineChange(new Date(detail.close_at))
    }
    setInitialized(true)
  }, [
    detail,
    initialized,
    setTitle,
    setContent,
    setEstimatedFee,
    setExpectedHeadcount,
    setTagIds,
    handleDeadlineChange,
  ])

  return (
    <form className="flex flex-col gap-8" onSubmit={actions.handleSubmit}>
      <BasicInfoSection
        state={state}
        actions={actions}
        options={options}
        lectures={formattedLectures}
        lecturesLoading={lecturesLoading}
        totalLecturePrice={totalLecturePrice}
      />
      <ContentSection state={state} actions={actions} />
      <ExtraInfoSection
        state={state}
        actions={actions}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        isTagModalOpen={isTagModalOpen}
        onOpenTagModal={setIsTagModalOpen}
      />
      <section className="my-8 flex justify-end gap-4 border-t border-gray-200 pt-[25px]">
        <Button variant="outline" type="button" className="px-6 py-3">
          취소
        </Button>
        <Button variant="primary" type="submit" className="px-6 py-3">
          공고 등록
        </Button>
      </section>
    </form>
  )
}
