import AppRoutes from '@/routes/AppRoutes'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { getUserInformationApi } from './api/userInformation'
import { useAuthStore } from './store/userStore'

function App() {
  /* 리프레쉬토큰 */
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (import.meta.env.VITE_NODE_ENV === 'development') {
          const userData = await getUserInformationApi()
          useAuthStore.getState().setUser(userData)
        } else {
          try {
            const userData = await getUserInformationApi()
            useAuthStore.getState().setUser(userData)
          } catch (error) {
            console.log(error, '토큰발급에러')
            return
          }
        }
      } catch (error) {
        console.log(error, '비회원입니다')
      }
    }
    initAuth()
  }, [])

  return (
    <>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        icon={false}
        closeButton={false}
      />
    </>
  )
}
export default App
