import announcement from '@/assets/icons/announcement.svg'
import classIcon from '@/assets/icons/class.svg'
import close from '@/assets/icons/close.svg'
import logoutIcon from '@/assets/icons/logout.svg'
import profileImage from '@/assets/icons/profileImg.svg'
import study from '@/assets/icons/study.svg'
import defaultProfileImg from '@/assets/images/defaultProfileImg.svg'
import logo from '@/assets/images/logo.svg'
import { ROUTE_PATHS } from '@/constant/route'
import { useAuthStore } from '@/store/userStore'
interface MobileModalProps {
  setIsModalOpen: (value: boolean) => void
}
function MobileModal({ setIsModalOpen }: MobileModalProps) {
  const { user, loginState } = useAuthStore()
  return (
    <div className="bg-basic-white fixed top-0 left-0 z-10 h-screen w-[263px] pt-4 md:hidden">
      <div className="border-b border-solid border-gray-200">
        <div className="ml-4 flex items-center gap-43 pb-[15px]">
          <img src={logo} alt="logo" className="h-8 w-8" />
          <img
            src={close}
            alt="close"
            className="h-7 w-7"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
      </div>
      <div className="ml-7 flex flex-col gap-2 py-4">
        <span className="flex h-9 items-center text-base font-semibold text-gray-400">
          메뉴
        </span>
        <div className="flex h-12 items-center gap-3">
          <img src={classIcon} alt="classIcon" />
          <a href="/courses">강의 목록</a>
        </div>
        <div className="flex h-12 items-center gap-3">
          <img src={study} alt="studyIcon" />
          <a href={ROUTE_PATHS.STUDY}>스터디 그룹</a>
        </div>
        <div className="flex h-12 items-center gap-3">
          <img src={announcement} alt="announcementIcon" />
          <a href="/recruitments">구인 광고</a>
        </div>
      </div>
      {/* user 일때만 나타나게 */}
      {loginState === 'USER' && (
        <div className="absolute bottom-[70px] flex h-[117px] w-full flex-col gap-3 border-t border-solid border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <img
              src={defaultProfileImg}
              alt="defaultProfileImg"
              className="h-[60px] w-[60px] rounded-full"
            />
            {/* 추후 api 연동으로 이미지 불러오게 */}
            <div className="flex flex-col">
              <span className="font-semiblod text-base text-gray-900">
                {user?.name}
              </span>
              <span className="text-base font-normal text-gray-600">
                {user?.email}
              </span>
              {/* 추후 api 연동으로 이름 및 이메일 불러오게 */}
            </div>
          </div>
          <button className="flex cursor-pointer items-center justify-center gap-[13px] rounded-lg bg-[#FEF9C3] px-4 py-2">
            <img src={profileImage} alt="profileImg" />
            <a
              href={ROUTE_PATHS.MYPAGE}
              className="text-primary-600 text-base font-medium"
            >
              마이페이지
            </a>
          </button>
          <button className="flex cursor-pointer items-center justify-center gap-[13px] rounded-lg bg-gray-100 px-4 py-2">
            <img src={logoutIcon} alt="logoutIcon" />
            <span className="text-base font-medium text-gray-700">
              로그아웃
            </span>
          </button>
          {/* 버튼 컴포넌트 완료되면 버튼 컴포넌트로 커스텀 + 로그아웃 시키기 */}
        </div>
      )}
    </div>
  )
}
export default MobileModal
