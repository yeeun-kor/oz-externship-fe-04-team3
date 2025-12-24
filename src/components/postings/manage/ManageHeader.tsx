import { Button } from '@/components/common'
import { ArrowLeft, Plus } from 'lucide-react'

type ManageHeaderProps = {
  onClickWrite?: () => void
  onClickBack?: () => void
}

export default function ManageHeader({
  onClickWrite,
  onClickBack,
}: ManageHeaderProps) {
  return (
    <div className="flex-between flex-col gap-8 md:flex-row">
      <div className="flex-center mr-auto gap-4">
        <Button
          variant="ghost"
          className="h-10 w-10 cursor-pointer rounded-full bg-gray-100 hover:bg-gray-200"
          onClick={onClickBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">공고 관리</h2>
          <p className="text-base text-gray-500">
            내가 등록한 스터디 구인 공고를 관리하세요
          </p>
        </div>
      </div>
      <Button
        variant="primary"
        className="mr-auto w-full cursor-pointer md:mr-0 md:w-fit"
        onClick={onClickWrite}
      >
        <Plus className="h-6 w-6" /> 새 공고 작성하기
      </Button>
    </div>
  )
}
