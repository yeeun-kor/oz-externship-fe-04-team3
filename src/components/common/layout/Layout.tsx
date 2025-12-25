import Footer from '@/components/common/footer/Footer'
import Header from '@/components/common/header/Header'
import { useAuthStore } from '@/store/userStore'
import { useState } from 'react'
import { Outlet } from 'react-router'
import { ChatWidget } from '../chat/ChatWidget'

function Layout() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  const { loginState } = useAuthStore()
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <Header
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
      />
      <main className="wrapper flex-1">
        <Outlet />
      </main>
      <Footer />
      {isSideBarOpen && (
        <div className="fixed top-[0px] left-0 h-full w-full bg-black opacity-50 md:hidden"></div>
      )}
      {/* 로그인된 사용자에게만 위젯 노출 */}
      {loginState === 'USER' && <ChatWidget />}
    </div>
  )
}
export default Layout
