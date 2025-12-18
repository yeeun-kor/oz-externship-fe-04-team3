import Layout from '@/components/common/layout/Layout'
import CoursesPage from '@/pages/CoursesPage'
import Main from '@/pages/main'
import ManagePage from '@/pages/postings/Manage'
import RecruitmentListPage from '@/pages/postings/RecruitmentListPage'
import RecruitmentDetailPage from '@/pages/postings/RecruitmentDetailPage'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import WritePage from '@/pages/postings/Write'
import YeeunTest from '@/pages/YeeunTest'
import { useAuthStore } from '@/store/userStore'
import { Navigate, Route, Routes } from 'react-router-dom'

function AppRoutes() {
  const { user, loginState } = useAuthStore()

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            loginState === 'USER' ? (
              <Navigate to="/recruitments/test" replace />
            ) : (
              <Navigate to="/recruitments" replace />
            )
          }
        />

        <Route path="/yeeun" element={<YeeunTest />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/manage" element={<ManagePage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/main" element={<Main />} />
        <Route
          path="/recruitments"
          element={<RecruitmentListPage isLoggedIn={false} userName="사용자" />}
        />
        <Route
          path="/recruitments/test"
          element={
            <RecruitmentListPage
              isLoggedIn={loginState === 'USER'}
              userName={user?.name}
            />
          }
        />

        <Route
          path="/recruitments/:id"
          element={
            <ProtectedRoute>
              <RecruitmentDetailPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default AppRoutes
