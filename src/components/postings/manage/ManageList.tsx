import ManageCard from './ManageCard'
import ManageCardSkeleton from './ManageCardSkeleton'
import type { ManageRecruitment } from '@/types/myRecruitment'
import NoData from '@/components/notFound/NoData'

type ManageListProps = {
  postings: ManageRecruitment[]
  isLoading?: boolean
  onDeleted?: () => void
  autoOpenId?: string | null
  onAutoOpenConsumed?: () => void
}

export default function ManageList({
  postings,
  isLoading,
  onDeleted,
  autoOpenId,
  onAutoOpenConsumed,
}: ManageListProps) {
  if (isLoading) {
    return <ManageCardSkeleton count={6} />
  }

  if (postings.length === 0) {
    return <NoData className="max-w-full" />
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {postings.map((posting) => {
        const shouldAutoOpen = !!autoOpenId && posting.uuid === autoOpenId
        return (
          <ManageCard
            key={posting.uuid}
            posting={posting}
            onDeleted={onDeleted}
            autoOpen={shouldAutoOpen}
            onAutoOpenConsumed={onAutoOpenConsumed}
          />
        )
      })}
    </div>
  )
}
