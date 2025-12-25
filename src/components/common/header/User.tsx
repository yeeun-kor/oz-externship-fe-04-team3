import notificationIcon from '@/assets/icons/notification.svg'
import topArrow from '@/assets/icons/topArrow.svg'
import useIsDesktop from '@/hooks/useIsDesktop'

import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'

import { ROUTE_PATHS } from '@/constant/route'
import { useAuthStore } from '@/store/userStore'
import { useNavigate } from 'react-router'
import NotificationModal from '../notification/NotificationModal'
import UserModal from './UserModal'
function User() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isAlarmOpen, setIsAlarmOpen] = useState(false)
  const [isAlarmAnimating, setIsAlarmAnimating] = useState(false)
  const isDesktop = useIsDesktop()
  const navigate = useNavigate()
  // 로그인했을때의 모달 상태 관리
  const handleUserModal = () => {
    setIsUserModalOpen((prev) => !prev)
  }
  // 알림 모달 토글 (애니메이션 중에는 연타 방지)
  const handleAlarmModal = () => {
    if (isAlarmAnimating) return
    setIsAlarmAnimating(true)
    setIsAlarmOpen((prev) => !prev)
    if (isUserModalOpen) {
      setIsUserModalOpen(false)
    }
  }

  const { user } = useAuthStore()
  return (
    <div className="ml-auto flex">
      <div className="flex items-center gap-8 text-base text-gray-700">
        <div className="hidden md:flex md:gap-8">
          <span
            onClick={() => navigate('/courses')}
            className="hover:text-primary-600 cursor-pointer"
          >
            강의 목록
          </span>
          <a
            href={ROUTE_PATHS.STUDY}
            className="hover:text-primary-600 cursor-pointer"
          >
            스터디 그룹
          </a>
          <span
            onClick={() => navigate('/recruitments')}
            className="hover:text-primary-600 cursor-pointer"
          >
            구인 공고
          </span>
        </div>
        <div className="relative">
          <img
            src={notificationIcon}
            alt="notificationIcon"
            className="h-[30px] w-[30px] cursor-pointer"
            onClick={handleAlarmModal}
          />
          {/* 알림 모달,바텀시트 오픈 */}
          {/* 모바일일 때만 배경 오버레이 렌더링 */}
          {!isDesktop && isAlarmOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/30 md:bg-transparent"
              onClick={() => {
                setIsAlarmAnimating(true)
                setIsAlarmOpen(false)
              }}
            />
          )}
          <AnimatePresence
            mode="wait"
            onExitComplete={() => setIsAlarmAnimating(false)}
          >
            {isAlarmOpen && (
              <NotificationModal
                isDesktop={isDesktop}
                onClose={() => {
                  setIsAlarmAnimating(true)
                  setIsAlarmOpen(false)
                }}
                onAnimationComplete={() => setIsAlarmAnimating(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* 클릭하면 유저 모달 나오게 */}
      <div
        className="relative ml-4 flex cursor-pointer items-center gap-2"
        onClick={handleUserModal}
      >
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#FEF9C3]">
          <img
            src={user?.profile_img_url}
            alt="profileIcon"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="text-primary-600 text-base">{user?.name}</div>
        {isUserModalOpen ? (
          <img
            src={topArrow}
            alt="topArrow"
            className="hidden md:block md:h-[17px] md:w-[17px]"
          />
        ) : (
          <img
            src={topArrow}
            alt="bottomArrow"
            className="hidden md:block md:h-[17px] md:w-[17px] md:rotate-180"
          />
        )}
        {isUserModalOpen && <UserModal />}
        {/* 추후 목업데이터로 먼저 구현예정 */}
      </div>
    </div>
  )
}
export default User
