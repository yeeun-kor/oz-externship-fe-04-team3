import Footer from '@/components/common/footer/Footer'
import Header from '@/components/common/header/Header'
import { useState } from 'react'
import { Outlet } from 'react-router'

function Layout() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
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
    </div>
  )
}
export default Layout
