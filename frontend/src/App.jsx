import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/services/supabase'
import Layout from '@/components/layout/Layout'

// Pages
import Landing       from '@/pages/Landing'
import Login         from '@/pages/Login'
import AuthCallback  from '@/pages/AuthCallback'
import StudentDashboard from '@/pages/student/Dashboard'
import StudentResults   from '@/pages/student/Results'
import GazetteReader    from '@/pages/student/GazetteReader'
import FacultyDashboard from '@/pages/faculty/Dashboard'
import MarkEntry        from '@/pages/faculty/MarkEntry'
import HodDashboard     from '@/pages/hod/Dashboard'
import HodReports       from '@/pages/hod/Reports'
import HodBranchResults from '@/pages/hod/BranchResults'

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { isAuthenticated, role, setAuth, restoreSession } = useAuthStore()

  // ── Listen to Supabase auth state changes ───────────────────────
  useEffect(() => {
    // Restore persisted session on first load
    restoreSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'TOKEN_REFRESHED' && session) {
          // Silently update the access token when Supabase refreshes it
          const user = session.user
          const role = user.user_metadata?.role || user.app_metadata?.role || 'STUDENT'
          useAuthStore.getState().setAuth({
            user:    { id: user.id, email: user.email },
            token:   session.access_token,
            role,
            profile: useAuthStore.getState().profile ||
                     { name: user.user_metadata?.name || user.email },
          })
        }

        if (event === 'SIGNED_OUT') {
          // Use clearAuth (NOT logout) to avoid re-triggering signOut
          useAuthStore.getState().clearAuth()
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const getRoleHome = () => {
    if (role === 'STUDENT') return '/student/dashboard'
    if (role === 'FACULTY') return '/faculty/dashboard'
    if (role === 'HOD')     return '/hod/dashboard'
    return '/login'
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={
        isAuthenticated ? <Navigate to={getRoleHome()} replace /> : <Login />
      } />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['STUDENT']}>
          <Layout role="STUDENT" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="results"   element={<StudentResults />} />
        <Route path="gazette"   element={<GazetteReader />} />
      </Route>

      {/* Faculty Routes */}
      <Route path="/faculty" element={
        <ProtectedRoute allowedRoles={['FACULTY']}>
          <Layout role="FACULTY" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="marks"     element={<MarkEntry />} />
      </Route>

      {/* HoD Routes */}
      <Route path="/hod" element={
        <ProtectedRoute allowedRoles={['HOD']}>
          <Layout role="HOD" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<HodDashboard />} />
        <Route path="reports"   element={<HodReports />} />
        <Route path="results"   element={<HodBranchResults />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
