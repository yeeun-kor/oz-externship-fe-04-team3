import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/userStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const loginState = useAuthStore((state) => state.loginState)
  const location = useLocation()

  if (loginState === 'GUEST') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
