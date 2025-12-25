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
  const { loginState } = useAuthStore()

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            loginState === 'USER' ? (
              <Navigate to="/recruitments" replace />
            ) : (
              <Navigate to="/recruitments" replace />
            )
          }
        />

        <Route path="/yeeun" element={<YeeunTest />} />
        <Route path="/courses" element={<CoursesPage />} />

        <Route
          path="/manage"
          element={
            <ProtectedRoute>
              <ManagePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/write"
          element={
            <ProtectedRoute>
              <WritePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruitments/edit/:id"
          element={
            <ProtectedRoute>
              <WritePage />
            </ProtectedRoute>
          }
        />

        <Route path="/recruitments" element={<RecruitmentListPage />} />
        <Route path="/recruitments/:id" element={<RecruitmentDetailPage />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
