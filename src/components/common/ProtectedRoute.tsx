import { Navigate, useLocation } from 'react-router-dom'
import loginStateStore from '@/store/loginStateStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const loginState = loginStateStore((state) => state.loginState)
  const location = useLocation()

  if (loginState === 'GUEST') {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children as React.ReactElement
}

export default ProtectedRoute
