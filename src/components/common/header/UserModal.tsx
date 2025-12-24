import logoutIcon from '@/assets/icons/logout.svg'
import modalProfileIcon from '@/assets/icons/modalProfileIcon.svg'
import { ROUTE_PATHS } from '@/constant/route'
import { useAuthStore } from '@/store/userStore'
function UserModal() {
  const { clearAuth } = useAuthStore()
  return (
    <div className="md:bg-basic-white hidden md:absolute md:top-[45.05px] md:right-2.5 md:flex md:h-[99px] md:w-48 md:flex-col md:gap-2 md:rounded-lg md:border md:border-solid md:border-[#E5E7EB] md:drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)]">
      <div className="mt-[13px] flex cursor-pointer items-center gap-3 border-t-2 border-solid border-gray-100 px-4 py-2.5 pt-[5px] text-[16px] text-gray-700">
        <img src={logoutIcon} alt="logoutIcon" className="h-[18px] w-[18px]" />
        <span onClick={() => clearAuth()}>로그아웃</span>
        {/* 클릭하면 로그아웃 시키기 */}
      </div>
      <div className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-[16px] text-gray-700">
        <img
          src={modalProfileIcon}
          alt="modalProfileIcon"
          className="h-[18px] w-[18px]"
        />
        <a href={ROUTE_PATHS.MYPAGE}>마이페이지</a>
        {/* 클릭하면 마이페이지로 이동 */}
      </div>
    </div>
  )
}
export default UserModal
