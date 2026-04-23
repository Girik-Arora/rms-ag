import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/services/api'

const ROLE_ROUTES = {
  STUDENT: '/student/dashboard',
  FACULTY: '/faculty/dashboard',
  HOD:     '/hod/dashboard',
}

/**
 * AuthCallback — handles OAuth redirects (GitHub, Google).
 * Supabase redirects here after OAuth sign-in.
 * Extracts session, syncs with backend, updates store.
 */
export default function AuthCallback() {
  const navigate = useNavigate()
  const setAuth  = useAuthStore(s => s.setAuth)

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        console.error('OAuth callback error:', error)
        navigate('/login')
        return
      }

      const user = session.user
      const role = user.user_metadata?.role || user.app_metadata?.role || 'STUDENT'

      let profile = null
      try {
        profile = await authApi.syncProfile({
          userId: user.id,
          email:  user.email,
          name:   user.user_metadata?.full_name || user.user_metadata?.name || user.email,
          role,
        })
      } catch (e) {
        profile = { name: user.user_metadata?.full_name || user.email }
      }

      setAuth({
        user:    { id: user.id, email: user.email },
        token:   session.access_token,
        role,
        profile,
      })

      navigate(ROLE_ROUTES[role] || '/student/dashboard')
    }

    handleCallback()
  }, [])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg-base)',
    }}>
      <div style={{
        width: 56, height: 56,
        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
        borderRadius: 16, marginBottom: '1.5rem',
        animation: 'pulse 1.5s ease infinite',
      }} />
      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Signing you in...</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 8 }}>Setting up your portal</div>
      <style>{`@keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.7; transform:scale(0.95); } }`}</style>
    </div>
  )
}
