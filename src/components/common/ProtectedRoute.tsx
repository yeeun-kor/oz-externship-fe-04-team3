import { useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/userStore'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const loginState = useAuthStore((state) => state.loginState)
  const location = useLocation()

  useEffect(() => {
    if (loginState === 'GUEST') {
      const currentUrl = window.location.href
      const redirectUrl = `https://account.ozcoding.site/login?from=${encodeURIComponent(
        currentUrl
      )}`
      window.location.href = redirectUrl
    }
  }, [loginState, location])

  if (loginState === 'GUEST') return null

  return children
}

export default ProtectedRoute
