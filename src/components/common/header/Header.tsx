import logoImg from '@/assets/images/logo.svg'
import Guest from '@/components/common/header/Guest'
import { ROUTE_PATHS } from '@/constant/route'
import { useAuthStore } from '@/store/userStore'
import { Menu } from 'lucide-react'
import { useNavigate } from 'react-router'
import MobileModal from './MobileModal'
import User from './User'

interface HeaderProps {
  isSideBarOpen: boolean
  setIsSideBarOpen: (value: boolean) => void
}

function Header({ isSideBarOpen, setIsSideBarOpen }: HeaderProps) {
  const navigate = useNavigate()
  const { loginState } = useAuthStore()

  const handleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen)
  }

  return (
    <div className="w-full border-b border-solid border-[#E5E7EB] bg-white">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-8">
        {isSideBarOpen && <MobileModal setIsModalOpen={setIsSideBarOpen} />}
        <div className="flex items-center gap-[15px] md:hidden">
          <Menu className="h-6 w-6 cursor-pointer" onClick={handleSideBar} />
          <img
            src={logoImg}
            alt="logoImg"
            className="h-[35px] w-[35px] cursor-pointer"
            onClick={() => navigate(ROUTE_PATHS.HOME)}
          />
        </div>
        <div
          className="hidden md:flex md:cursor-pointer md:items-center md:gap-2"
          onClick={() => navigate(ROUTE_PATHS.HOME)}
        >
          <img src={logoImg} alt="logoImg" className="flex h-[35px] w-[35px]" />
          <h2 className="text-2xl font-bold text-[#CA8A04]">StudyHub</h2>
        </div>
        {loginState === 'GUEST' && <Guest />}
        {loginState === 'USER' && <User />}
      </div>
    </div>
  )
}

export default Header
