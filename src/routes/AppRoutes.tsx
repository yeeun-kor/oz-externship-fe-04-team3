import Layout from '@/components/common/layout/Layout'
import CoursesPage from '@/pages/CoursesPage'
import Main from '@/pages/main'
import ManagePage from '@/pages/postings/Manage'
import RecruitmentListPage from '@/pages/postings/RecruitmentListPage'
import RecruitmentDetailPage from '@/pages/postings/RecruitmentDetailPage'
import WritePage from '@/pages/postings/Write'
import YeeunTest from '@/pages/YeeunTest'
import loginStateStore from '@/store/loginStateStore'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import { Navigate, Route, Routes } from 'react-router-dom'

function AppRoutes() {
  const loginState = loginStateStore((state) => state.loginState)
  const isLoggedIn = loginState === 'USER'
  const userName = isLoggedIn ? 'USER' : '사용자'

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            isLoggedIn ? (
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
            <RecruitmentListPage isLoggedIn={isLoggedIn} userName={userName} />
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
