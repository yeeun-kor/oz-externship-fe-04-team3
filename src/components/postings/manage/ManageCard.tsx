import { Bookmark, Calendar, Eye, Pencil, Trash2, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { Button, Modal } from '@/components/common'
import { Badge } from '@/components/common/badge'
import { Skeleton } from '@/components/common/skeleton'
import { getTypeIcon } from '@/helpers/icons'
import type { ManageRecruitment } from '@/types/myRecruitment'
import ApplicantDetailModal from './ApplicantDetailModal'
import type { ApplicantDetail } from './applicantTypes'
import { deleteMyRecruitment } from '@/api/myRecruitment'
import { showToast } from '@/components/common/toast/Toast'
import ManageApplicantsModal from './ManageApplicantsModal'
import { useApplicants } from '@/hooks/quries/useApplicants'
import { useApplicantDetail } from '@/hooks/quries/useApplicantDetail'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { approveApplication, rejectApplication } from '@/api/applications'

type ManageCardProps = {
  posting: ManageRecruitment
  onDeleted?: () => void
  autoOpen?: boolean
  onAutoOpenConsumed?: () => void
}

type DeleteModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onConfirm: () => void
  isDeleting: boolean
}

function ConfirmDeleteModal({
  open,
  onOpenChange,
  title,
  onConfirm,
  isDeleting,
}: DeleteModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="공고 삭제"
      description="삭제 후에는 되돌릴 수 없습니다."
      content={
        <div className="space-y-3 text-sm text-gray-700">
          <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3 text-red-700">
            공고를 삭제하면 지원 내역도 더 이상 확인할 수 없습니다.
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="font-semibold text-gray-900">삭제 대상</p>
            <p className="mt-1 line-clamp-2 text-gray-700">{title}</p>
          </div>
          <p className="text-xs text-gray-500">
            삭제를 원하지 않으면 취소 버튼을 눌러주세요.
          </p>
        </div>
      }
      footer={{
        closeButton: { text: '취소' },
        footerButtons: (
          <Button
            variant="danger"
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </Button>
        ),
      }}
    />
  )
}

export default function ManageCard({
  posting,
  onDeleted,
  autoOpen = false,
  onAutoOpenConsumed,
}: ManageCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(
    null
  )
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const applicantsQuery = useApplicants(posting.uuid, 10, isModalOpen)
  const applicantList =
    applicantsQuery.data?.pages.flatMap((page) => page.results) ?? []
  const totalApplicants = applicantList.length
  const detailQuery = useApplicantDetail(selectedApplicantId ?? undefined)
  const approveMutation = useMutation({
    mutationFn: (id: number) => approveApplication(id),
    onSuccess: () => {
      showToast.success('승인 완료', '지원이 승인되었습니다.')
      applicantsQuery.refetch()
      detailQuery.refetch()
    },
    onError: (err) => {
      showToast.error('승인 실패', (err as Error)?.message ?? '')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (id: number) => rejectApplication(id),
    onSuccess: () => {
      showToast.success('거절 완료', '지원이 거절되었습니다.')
      applicantsQuery.refetch()
      detailQuery.refetch()
    },
    onError: (err) => {
      showToast.error('거절 실패', (err as Error)?.message ?? '')
    },
  })

  const handleLoadMore = async () => {
    if (applicantsQuery.hasNextPage && !applicantsQuery.isFetchingNextPage) {
      await applicantsQuery.fetchNextPage()
    }
  }

  useEffect(() => {
    if (!autoOpen || isModalOpen) return
    setIsModalOpen(true)
    onAutoOpenConsumed?.()
  }, [autoOpen, isModalOpen, onAutoOpenConsumed])

  const selectedApplicant: ApplicantDetail | null = detailQuery.data ?? null

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteMyRecruitment(posting.uuid)
      showToast.success('삭제 완료', '공고가 삭제되었습니다.')
      queryClient.invalidateQueries({ queryKey: ['manageRecruitmentList'] })
      queryClient.invalidateQueries({
        queryKey: ['manageRecruitmentList-open-count'],
      })
      queryClient.invalidateQueries({
        queryKey: ['manageRecruitmentList-closed-count'],
      })
      setIsDeleteModalOpen(false)
      onDeleted?.()
    } catch (err) {
      showToast.error('삭제 실패', (err as Error)?.message ?? '')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="relative grid gap-4 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-[160px_1fr] md:items-start">
      {/* 썸네일 */}
      <div className="relative md:row-span-2">
        {!imgLoaded && (
          <Skeleton className="absolute inset-0 h-24 w-40 rounded-md md:h-32" />
        )}
        <img
          src={posting.thumbnailImgUrl}
          alt={posting.title}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
          className={`mx-auto h-32 w-full rounded-md object-cover transition-opacity duration-200 md:h-24 md:w-40 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* 내용 */}
      <div className="flex flex-col gap-3">
        <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900">
            {posting.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye size={16} />
              <span>{posting.viewsCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bookmark size={16} />
              <span>{posting.bookmarkCount}</span>
            </div>
            <button
              className="hover:text-primary-500 cursor-pointer text-gray-500"
              onClick={() => navigate(`/write?recruitmentId=${posting.uuid}`)}
            >
              <Pencil size={16} />
            </button>
            <button
              className="hover:text-danger-600 cursor-pointer text-gray-500"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>모집 인원 : {posting.expectedHeadcount}명</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>마감일 : {posting.closeAt.split('T')[0]}</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-gray-600">강의 목록 :</span>
              {posting.lectures.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {posting.lectures.map((lec) => (
                    <span key={lec.id} className="text-gray-700">
                      <i className="mr-2">·</i>
                      {lec.title}
                    </span>
                  ))}
                </div>
              ) : (
                <span>등록된 강의가 없습니다</span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {posting.tags.map((tag) => (
              <Badge key={tag.id} variant={'primary'}>
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* 지원 내역 버튼 */}
      <div className="md:absolute md:right-4 md:bottom-4 md:self-end">
        <Button
          className="btn-active-blue h-12 w-full px-6 py-3 md:w-[150px]"
          onClick={() => setIsModalOpen(true)}
        >
          {getTypeIcon('total')} 지원 내역
        </Button>
      </div>
      <ManageApplicantsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        recruitmentTitle={posting.title}
        totalCount={totalApplicants}
        applicants={applicantList}
        isLoading={applicantsQuery.isLoading}
        isFetchingNext={applicantsQuery.isFetchingNextPage}
        hasNextPage={applicantsQuery.hasNextPage}
        onLoadMore={handleLoadMore}
        onApplicantClick={(id) => setSelectedApplicantId(id)}
      />
      <ApplicantDetailModal
        open={selectedApplicantId !== null}
        onOpenChange={(open) =>
          setSelectedApplicantId(open ? selectedApplicantId : null)
        }
        applicant={selectedApplicant}
        isLoading={detailQuery.isLoading}
        onApprove={
          selectedApplicantId
            ? () => approveMutation.mutate(Number(selectedApplicantId))
            : undefined
        }
        onReject={
          selectedApplicantId
            ? () => rejectMutation.mutate(Number(selectedApplicantId))
            : undefined
        }
        isActionLoading={approveMutation.isPending || rejectMutation.isPending}
      />
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title={posting.title}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
