import { useParams, useSearchParams } from 'react-router-dom'
import WriteForm from '@/components/postings/write/WriteForm'
import WriteHeader from '@/components/postings/write/WriteHeader'

export default function Write() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()

  const recruitmentId = id || searchParams.get('recruitmentId')

  return (
    <div className="mx-auto flex flex-col gap-6">
      <WriteHeader />
      <WriteForm recruitmentId={recruitmentId || undefined} />
    </div>
  )
}
