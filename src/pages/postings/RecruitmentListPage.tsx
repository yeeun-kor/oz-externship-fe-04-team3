import PublicBanner from '@/components/postings/recruitment/PublicBanner'
import RecommendedSection from '@/components/postings/recruitment/RecommendedSection'
import RecruitmentCard from '@/components/postings/recruitment/RecruitmentCard'
import Modal from '@/components/common/Modal'
import { useRecruitments } from '@/hooks/recruitment/useRecruitments'
import { ArrowUp, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/common/Button'

interface RecruitmentListPageProps {
  isLoggedIn?: boolean
  userName?: string
}

export default function RecruitmentListPage({
  isLoggedIn = false,
  userName = '사용자',
}: RecruitmentListPageProps) {
  const navigate = useNavigate()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [pendingRecruitmentId, setPendingRecruitmentId] = useState<
    number | null
  >(null)

  const {
    searchKeyword,
    selectedCategory,
    selectedSort,
    recommendedRecruitments,
    displayedRecruitments,
    filteredAndSorted,
    hasMore,
    handleSearchChange,
    handleCategoryChange,
    handleSortChange,
    handleLoadMore,
  } = useRecruitments()

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleRecruitmentClick = (id: number) => {
    if (!isLoggedIn) {
      setPendingRecruitmentId(id)
      setShowLoginModal(true)
    } else {
      navigate(`/recruitments/${id}`)
    }
  }

  const handleLogin = () => {
    navigate('/login', {
      state: { from: `/recruitments/${pendingRecruitmentId}` },
    })
  }

  const allCategories = [
    'AI/인공지능',
    '응용 AI',
    'IT/프로그래밍',
    '게임 개발',
    '데이터 사이언스',
    'IT',
    '하드웨어',
    '디자인',
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">스터디 구인 공고</h1>
          <p className="mt-1 text-sm text-gray-600 md:text-base">
            새로운 스터디 팀원을 찾거나 관심있는 스터디에 참여해보세요!
          </p>
        </div>

        {isLoggedIn && (
          <RecommendedSection
            userName={userName}
            recommended={recommendedRecruitments}
            onClick={handleRecruitmentClick}
          />
        )}

        {!isLoggedIn && <PublicBanner />}

        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <div className="relative mb-4 max-w-md">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="공고 제목으로 검색해보세요"
              value={searchKeyword}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-yellow-400 md:py-3 md:text-base"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:gap-4">
            <div className="flex-1">
              <label className="mb-2 block text-xs text-gray-600 md:text-sm">
                카테고리
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 md:px-4 md:text-base"
              >
                <option>전체 카테고리</option>
                {allCategories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="mb-2 block text-xs text-gray-600 md:text-sm">
                정렬
              </label>
              <select
                value={selectedSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 md:px-4 md:text-base"
              >
                <option>최신순</option>
                <option>조회 많은 순</option>
                <option>북마크 많은 순</option>
              </select>
            </div>
          </div>
        </div>

        <h2 className="mb-4 text-xl font-bold">
          전체 공고 ({filteredAndSorted.length})
        </h2>

        {filteredAndSorted.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            검색 결과가 없습니다.
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {displayedRecruitments.map((item) => (
                <RecruitmentCard
                  key={item.id}
                  recruitment={item}
                  onClick={handleRecruitmentClick}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="rounded-lg border-2 border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="mr-1 inline h-5 w-5" />더 많은 공고 보기
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="fixed right-6 bottom-6">
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-400 text-white shadow-lg hover:bg-gray-500 md:h-14 md:w-14"
          >
            <ArrowUp className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        )}
      </div>

      <Modal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        title="로그인이 필요합니다"
        description="스터디 공고 상세 내용을 보려면 로그인이 필요합니다."
        content={
          <div className="py-4 text-center">
            <p className="text-gray-600">
              로그인하고 다양한 스터디를 만나보세요!
            </p>
          </div>
        }
        footer={{
          closeButton: { text: '취소' },
          footerButtons: (
            <Button variant="primary" onClick={handleLogin}>
              로그인하러 가기
            </Button>
          ),
        }}
      />
    </div>
  )
}
