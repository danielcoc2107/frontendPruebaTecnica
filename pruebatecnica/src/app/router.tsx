import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { setUnauthorizedHandler } from '../api/httpClient'
import { AppHeader } from '../components/AppHeader'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { FeedPage } from '../features/feed/FeedPage'
import { LoginPage } from '../features/login/LoginPage'
import { ProfilePage } from '../features/profile/ProfilePage'
import { useAuthStore } from '../store/authStore'

const UnauthorizedBridge = (): null => {
  const forceLogout = useAuthStore((state) => state.forceLogout)
  useEffect(() => {
    setUnauthorizedHandler(() => { forceLogout(); window.location.assign('/login') })
  }, [forceLogout])
  return null
}

export const AppRouter = () => {
  return (
    <Router>
      <UnauthorizedBridge />
      <AppHeader />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </Router>
  )
}

