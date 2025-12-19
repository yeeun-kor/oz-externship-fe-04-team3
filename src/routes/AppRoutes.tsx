import Layout from '@/components/common/layout/Layout'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import NotFound from '@/components/notFound/NotFound'
import CoursesPage from '@/pages/CoursesPage'
import ManagePage from '@/pages/postings/Manage'
import RecruitmentDetailPage from '@/pages/postings/RecruitmentDetailPage'
import RecruitmentListPage from '@/pages/postings/RecruitmentListPage'
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
        <Route path="*" element={<NotFound />}></Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
