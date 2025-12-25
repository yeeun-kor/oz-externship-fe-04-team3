import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from '@/components/common/Modal'
import { Badge } from '@/components/ui/badge'
import { getTypeIcon } from '@/helpers/icons'
import { Button } from '@/components/common'
import { Skeleton } from '@/components/ui/skeleton'
import { applicantStatusColor, applicantStatusLabel } from './applicantStatus'
import type { ApplicantDetail } from './applicantTypes'
import { cn } from '@/lib/utils'

type ApplicantDetailModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicant: ApplicantDetail | null
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  isLoading?: boolean
  isActionLoading?: boolean
}

export default function ApplicantDetailModal({
  open,
  onOpenChange,
  applicant,
  onApprove,
  onReject,
  isLoading,
  isActionLoading,
}: ApplicantDetailModalProps) {
  if (!applicant && !isLoading) return null

  const showFooter = applicant?.status === 'PENDING'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="h-[90dvh] max-h-[90dvh] w-[calc(100%-32px)] gap-0 overflow-hidden bg-white p-0 sm:max-h-[1150px] sm:max-w-max md:max-w-2xl"
        showCloseButton={false}
      >
        <div className="flex-between h-[72px] border-b border-gray-200 px-4 py-4 sm:px-6">
          <h3 className="text-lg font-semibold">지원자 상세정보</h3>
          <DialogClose asChild>
            <button className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700">
              {getTypeIcon('rejected')}
            </button>
          </DialogClose>
        </div>

        <div
          className={cn(
            `flex h-[calc(90dvh-72px-85px)] flex-col gap-4 overflow-y-auto px-4 py-4 sm:h-[calc(90dvh-72px-85px)] sm:px-6`,
            showFooter
              ? 'h-[calc(90dvh-72px-85px)] sm:h-[calc(90dvh-72px-85px)]'
              : 'h-[calc(90dvh-72px)] sm:h-[calc(90dvh-72px)]'
          )}
        >
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-3 text-sm font-semibold text-gray-700">
              지원자 정보
            </h4>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-100">
                {applicant?.thumbnail ? (
                  <img
                    src={applicant.thumbnail}
                    alt={applicant.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Skeleton className="h-full w-full bg-gray-400" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-base font-semibold">
                  {applicant?.name ?? '로딩 중'}
                </span>
                <span className="text-sm text-gray-600">
                  {applicant?.gender ?? ''}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1 text-sm text-gray-700">
                <span className="text-gray-500">지원 상태</span>
                <Badge
                  variant={
                    applicant
                      ? applicantStatusColor[applicant.status]
                      : 'default'
                  }
                >
                  {applicant ? applicantStatusLabel[applicant.status] : '...'}
                </Badge>
              </div>
              <div className="flex flex-col items-end gap-1 text-sm text-gray-700">
                <span className="text-gray-500">지원 일시</span>
                <span>{applicant?.appliedAt ?? '...'}</span>
              </div>
            </div>
          </div>

          <Section title="자기소개" content={applicant?.selfIntro ?? '...'} />
          <Section title="지원동기" content={applicant?.motivation ?? '...'} />
          <Section title="스터디 목표" content={applicant?.goal ?? '...'} />
          <Section
            title="가능한 시간대"
            content={applicant?.availableTime ?? '...'}
          />
          <div>
            <h5 className="mb-2 text-sm font-semibold text-gray-700">
              스터디 경험
            </h5>
            <div className="flex flex-col gap-2 rounded-lg bg-gray-50 p-4">
              <Badge variant={applicant?.hasExperience ? 'success' : 'danger'}>
                {applicant
                  ? applicant.hasExperience
                    ? '경험 있음'
                    : '경험 없음'
                  : '...'}
              </Badge>
              <p className="text-sm whitespace-pre-line text-gray-700">
                {applicant?.experienceDetail ?? '...'}
              </p>
            </div>
          </div>
        </div>

        {showFooter && (
          <DialogFooter className="h-fit flex-row justify-end gap-3 border-t border-gray-200 p-6">
            <Button
              variant="danger"
              className="w-[84px]"
              onClick={() => applicant && onReject?.(applicant.id)}
              disabled={isActionLoading}
            >
              {getTypeIcon('rejected')}
              {isActionLoading ? '처리 중' : '거절'}
            </Button>
            <Button
              variant="success"
              className="w-[84px]"
              onClick={() => applicant && onApprove?.(applicant.id)}
              disabled={isActionLoading}
            >
              {getTypeIcon('approved')}
              {isActionLoading ? '처리 중' : '승인'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h5 className="mb-2 text-sm font-semibold text-gray-700">{title}</h5>
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="line-clamp-6 text-sm whitespace-pre-line text-gray-700">
          {content}
        </p>
      </div>
    </div>
  )
}
