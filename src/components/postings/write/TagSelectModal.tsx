import { useEffect, useState } from 'react'
import { Button, Modal } from '@/components/common'
import { DashedBox } from '@/components/common/DashedBox'
import { Input } from '@/components/input'
import { Check, SearchIcon, X } from 'lucide-react'
import { Separator } from '@/components/common/separator'
import { showToast } from '@/components/common/toast/Toast'
import TagSvg from '@/assets/icons/Tag.svg'
import {
  getRecruitmentTags,
  createRecruitmentTag,
  type RecruitmentTag,
  type RecruitmentTagListResponse,
} from '@/api/recruitmentTag'
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import useDebounce from '@/hooks/useDebounce'

export type TagOption = {
  id: string
  name: string
}

type TagSelectModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: (selected: TagOption[]) => void
  maxSelectable?: number
  initialSelected?: TagOption[]
}

const PAGE_SIZE = 5

export function TagSelectModal({
  open,
  onOpenChange,
  onConfirm,
  maxSelectable = 5,
  initialSelected = [],
}: TagSelectModalProps) {
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialSelected.map((t) => t.id)
  )
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()
  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading } = useQuery({
    queryKey: ['recruitment-tags', debouncedSearch, page],
    queryFn: async () => {
      const res = await getRecruitmentTags({
        keyword: debouncedSearch || undefined,
        page,
        page_size: PAGE_SIZE,
      })
      return res
    },
    staleTime: 0,
    placeholderData: keepPreviousData,
  })

  const results = (data as RecruitmentTagListResponse | undefined)?.results
  const availableTags: TagOption[] =
    results?.map((t: RecruitmentTag) => ({
      id: String(t.id),
      name: t.name,
    })) ?? []

  const totalCount =
    (data as RecruitmentTagListResponse | undefined)?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const paginated = availableTags

  const selectedTags = availableTags.filter((tag) =>
    selectedIds.includes(tag.id)
  )

  // 이벤트/핸들러
  const toggleSelect = (id: string) => {
    const alreadySelected = selectedIds.includes(id)
    if (!alreadySelected && selectedIds.length >= maxSelectable) {
      showToast.warning(
        '태그 선택 제한',
        `태그는 최대 ${maxSelectable}개까지 선택할 수 있습니다.`
      )
      return
    }

    setSelectedIds((prev) => {
      if (alreadySelected) {
        return prev.filter((item) => item !== id)
      }
      return [...prev, id]
    })
  }

  const handleConfirm = () => {
    if (onConfirm) onConfirm(selectedTags)
    onOpenChange(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const hasNoResult =
    search.trim().length > 0 && !isLoading && availableTags.length === 0

  // 모달 열릴 때 초기 선택값 반영
  useEffect(() => {
    setSelectedIds(initialSelected.map((t) => t.id))
  }, [initialSelected])

  const renderSelectedTags = () => {
    if (selectedTags.length === 0) return null
    return (
      <>
        <div className="p-4">
          <p className="mb-2 text-sm font-medium text-gray-700">
            선택된 태그 ({selectedTags.length}/{maxSelectable})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag.id}
                className="bg-primary-50 text-primary-600 flex items-center gap-1 rounded-full px-3 py-1 text-sm"
              >
                {tag.name}
                <button
                  type="button"
                  onClick={() => toggleSelect(tag.id)}
                  className="text-primary-500"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
        <Separator
          style={{
            width: '100%',
            maxWidth: 'none',
          }}
        />
      </>
    )
  }

  const handleCreateTag = async () => {
    const name = search.trim()
    if (!name) return
    try {
      const newTag = await createRecruitmentTag(name)
      // 새 태그를 선택 상태에 추가하고 목록 재요청
      setSelectedIds((prev) =>
        Array.from(new Set([...prev, String(newTag.id)]))
      )
      queryClient.invalidateQueries({ queryKey: ['recruitment-tags'] })
      showToast.success('태그 생성', '새 태그가 추가되었습니다.')
    } catch (error) {
      showToast.error('태그 생성 실패', '태그 생성 중 오류가 발생했습니다.')
    }
  }

  const renderEmptyState = () => (
    <div className="flex flex-col gap-3 p-6">
      <DashedBox
        className="bg-primary-50 flex flex-col gap-2 p-4"
        color="var(--color-primary-300)"
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-primary-800 text-sm">
            <p>‘{search}’ 태그를 새로 만드시겠습니까?</p>
            <p className="text-primary-600">
              검색 결과에 원하는 태그가 없는 경우 새로 등록할 수 있습니다.
            </p>
          </div>
          <Button variant="primary" type="button" onClick={handleCreateTag}>
            새로 등록하기
          </Button>
        </div>
      </DashedBox>
      <div className="flex flex-col items-center gap-2 rounded-lg p-6 text-center">
        <div className="flex-center h-16 w-16 rounded-full bg-gray-100">
          <img src={TagSvg} alt="tag" className="h-5 w-5 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-700">
          검색 결과가 없습니다
        </p>
        <p className="text-xs text-gray-500">
          다른 키워드로 검색하거나 새 태그를 등록해보세요
        </p>
      </div>
    </div>
  )

  const renderTagList = () => (
    <div className="flex flex-col gap-3 p-6">
      <div className="flex items-center justify-between text-sm text-gray-700">
        <span>사용 가능한 태그 ({totalCount}개)</span>
      </div>
      <div className="grid gap-2">
        {paginated.map((tag) => {
          const checked = selectedIds.includes(tag.id)
          return (
            <button
              type="button"
              key={tag.id}
              onClick={() => toggleSelect(tag.id)}
              className={`hover:border-primary-400 flex items-center justify-between rounded-lg border px-4 py-3 text-left transition ${
                checked
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <span className="font-medium">{tag.name}</span>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-sm border-2 ${
                  checked
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}
                aria-hidden
              >
                {checked && <Check size={12} className="text-white" />}
              </span>
            </button>
          )
        })}
      </div>
      <div className="flex-center gap-2">
        <Button
          variant="outline"
          type="button"
          className="h-10 w-10 border border-gray-300 px-0"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        >
          {'<'}
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1
            const isActive = pageNum === page
            if (totalPages > 9 && pageNum > 9) return null
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => setPage(pageNum)}
                className={`h-10 w-10 rounded-md border border-gray-300 text-sm font-medium ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>
        <Button
          variant="outline"
          type="button"
          className="h-10 w-10 px-0"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
        >
          {'>'}
        </Button>
      </div>
    </div>
  )

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="태그선택"
      description={`공고에 추가할 태그를 선택하세요 (${selectedIds.length}/${maxSelectable})`}
      contentClassName="max-h-[90dvh] w-[calc(100%-32px)] sm:max-w-[672px] max-w-[672px]"
      bodyClassName="p-0"
      content={
        <div className="flex flex-col">
          <div className="p-4">
            <Input
              name="tag-search"
              placeholder="태그명으로 검색..."
              value={search}
              onChange={handleSearchChange}
              prefix={<SearchIcon size={14} />}
            />
          </div>
          <Separator
            style={{
              width: '100%',
              maxWidth: 'none',
            }}
          />

          {renderSelectedTags()}

          {isLoading ? (
            <div className="p-6 text-sm text-gray-500">
              태그를 불러오는 중...
            </div>
          ) : hasNoResult ? (
            renderEmptyState()
          ) : (
            renderTagList()
          )}
        </div>
      }
      footer={{
        description:
          selectedIds.length === 0
            ? '선택된 태그가 없습니다'
            : `${selectedIds.length}개 선택됨`,
        closeButton: { text: '취소' },
        footerButtons: (
          <Button
            variant="primary"
            type="button"
            disabled={selectedIds.length === 0}
            onClick={handleConfirm}
          >
            선택 완료
          </Button>
        ),
      }}
    />
  )
}
