import { Bookmark, Calendar, Eye, Pencil, Trash2, Users } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/common'
import { Badge } from '@/components/common/badge'
import { Skeleton } from '@/components/common/skeleton'
import { getTypeIcon } from '@/helpers/icons'
import type { ManageRecruitment } from '@/types/myRecruitment'
import ApplicantDetailModal from './ApplicantDetailModal'
import type { Applicant, ApplicantDetail } from './applicantTypes'
import ManageApplicantsModal from './ManageApplicantsModal'

type ManageCardProps = {
  posting: ManageRecruitment
}

export default function ManageCard({ posting }: ManageCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(
    null
  )
  // TODO: api 연동 필요
  const mockApplicants: Applicant[] = [
    {
      id: '1',
      name: '김지원',
      gender: '여성',
      status: 'PENDING' as const,
      appliedAt: '2024-11-25 14:30',
      availableTime:
        '평일 저녁 7-10시, 주말 오후 시간대 참여 가능합니다. 평일 저녁 7-10시, 주말 오후 시간대 참여 가능합니다. 평일 저녁 7-10시, 주말 오후 시간대 참여 가능합니다.',
      hasExperience: false,
      thumbnail: '',
    },
    {
      id: '2',
      name: '박개발',
      gender: '남성',
      status: 'ACCEPTED' as const,
      appliedAt: '2024-11-24 10:10',
      availableTime: '주말 오전/오후, 평일 9시 이후 가능',
      hasExperience: true,
      thumbnail: '',
    },
    {
      id: '3',
      name: '최코딩',
      gender: '여성',
      status: 'REJECTED' as const,
      appliedAt: '2024-11-23 20:45',
      availableTime: '평일 오후 6-8시',
      hasExperience: true,
      thumbnail: '',
    },
    {
      id: '4',
      name: '이프론트',
      gender: '남성',
      status: 'PENDING' as const,
      appliedAt: '2024-11-22 09:20',
      availableTime: '주중 8-10시, 주말 오후',
      hasExperience: false,
      thumbnail: '',
    },
    {
      id: '5',
      name: '이프론트',
      gender: '남성',
      status: 'CANCELED' as const,
      appliedAt: '2024-11-22 09:20',
      availableTime: '주중 8-10시, 주말 오후',
      hasExperience: false,
      thumbnail: '',
    },
  ]

  const applicantDetails: ApplicantDetail[] = mockApplicants.map(
    (applicant) => ({
      ...applicant,
      selfIntro: '안녕하세요, 백엔드 개발자로 성장하고 싶은 지원자입니다.',
      motivation:
        'Node.js 실무 경험을 쌓고 협업 역량을 키우기 위해 지원했습니다.',
      goal: '스터디를 통해 프로젝트 완성도를 높이고 코드 리뷰를 통해 성장하고 싶습니다.',
      experienceDetail:
        '이전에 소규모 스터디에 참여한 경험이 있으며, 주로 서버 API 개발을 맡았습니다.',
    })
  )

  const selectedApplicant =
    applicantDetails.find((a) => a.id === selectedApplicantId) ?? null

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
            <button className="text-gray-500 hover:text-gray-700">
              <Pencil size={16} />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
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
        totalCount={mockApplicants.length}
        applicants={mockApplicants}
        onApplicantClick={(id) => setSelectedApplicantId(id)}
      />
      <ApplicantDetailModal
        open={selectedApplicantId !== null}
        onOpenChange={(open) =>
          setSelectedApplicantId(open ? selectedApplicantId : null)
        }
        applicant={selectedApplicant}
      />
    </div>
  )
}
