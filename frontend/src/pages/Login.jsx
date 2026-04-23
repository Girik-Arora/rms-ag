import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/services/supabase'
import { authApi } from '@/services/api'
import toast from 'react-hot-toast'
import { GraduationCap, Eye, EyeOff, ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react'

const ROLE_ROUTES = {
  STUDENT: '/student/dashboard',
  FACULTY: '/faculty/dashboard',
  HOD:     '/hod/dashboard',
}

export default function Login() {
  const navigate = useNavigate()
  const setAuth  = useAuthStore(s => s.setAuth)

  const [tab, setTab]           = useState('login')   // 'login' | 'signup'
  const [form, setForm]         = useState({ email: '', password: '', name: '', role: 'STUDENT' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleChange = e => {
    setError('')
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  // ─── SIGN IN ──────────────────────────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please enter email and password'); return }
    setLoading(true)
    setError('')

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email:    form.email,
        password: form.password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      const session = data.session
      const user    = data.user

      // Extract role from user metadata (set during signup or by admin)
      const role = user.user_metadata?.role || user.app_metadata?.role || 'STUDENT'

      // Sync profile with Spring Boot backend
      let profile = null
      try {
        profile = await authApi.syncProfile({
          userId: user.id,
          email:  user.email,
          name:   user.user_metadata?.name || user.email,
          role,
        })
      } catch (syncErr) {
        console.warn('Profile sync failed (backend may not be running):', syncErr.message)
        profile = { name: user.user_metadata?.name || user.email }
      }

      setAuth({
        user:    { id: user.id, email: user.email },
        token:   session.access_token,
        role,
        profile,
      })

      toast.success(`Welcome back! 👋`)
      navigate(ROLE_ROUTES[role] || '/student/dashboard')

    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ─── SIGN UP ──────────────────────────────────────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password || !form.name) { setError('Please fill all fields'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email:    form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            role: form.role,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data.user && !data.session) {
        // Email confirmation required
        toast.success('Account created! Check your email to confirm your account.')
        setTab('login')
      } else if (data.session) {
        toast.success('Account created and signed in!')
        // Auto sign-in flow
        const role = form.role
        setAuth({
          user:    { id: data.user.id, email: data.user.email },
          token:   data.session.access_token,
          role,
          profile: { name: form.name },
        })
        navigate(ROLE_ROUTES[role] || '/student/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ─── OAUTH (GitHub / Google) ───────────────────────────────────────────────
  const handleOAuth = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) toast.error(error.message)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg-base)',
      padding: '2rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(59,130,246,0.08), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(16,185,129,0.06), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: 56, height: 56,
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            borderRadius: 16, margin: '0 auto 1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(59,130,246,0.3)',
          }}>
            <GraduationCap size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
            RMS<span style={{ color: '#3b82f6' }}>·AG</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            College Result Management System
          </p>
        </div>

        {/* Card */}
        <div className="glass-strong" style={{ borderRadius: 20, padding: '2rem' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4, marginBottom: '1.5rem' }}>
            {['login', 'signup'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError('') }} style={{
                flex: 1, padding: '0.5rem',
                background: tab === t ? 'rgba(59,130,246,0.2)' : 'transparent',
                border: tab === t ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                color: tab === t ? '#60a5fa' : 'var(--color-text-muted)',
                transition: 'all 0.2s ease',
              }}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem',
            }}>
              <AlertCircle size={14} color="#f87171" />
              <span style={{ fontSize: '0.8rem', color: '#f87171' }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={tab === 'login' ? handleSignIn : handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {tab === 'signup' && (
              <>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6, display: 'block' }}>Full Name</label>
                  <input type="text" name="name" className="input-field" placeholder="Rahul Sharma" value={form.name} onChange={handleChange} autoComplete="name" />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6, display: 'block' }}>Role</label>
                  <select name="role" className="input-field" value={form.role} onChange={handleChange} style={{ cursor: 'pointer', appearance: 'none' }}>
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="HOD">Head of Department (HoD)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6, display: 'block' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="var(--color-text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input type="email" name="email" className="input-field" placeholder="your@college.edu" value={form.email} onChange={handleChange} style={{ paddingLeft: '2.25rem' }} autoComplete="email" />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6, display: 'block' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="var(--color-text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input type={showPass ? 'text' : 'password'} name="password" className="input-field" placeholder="••••••••" value={form.password} onChange={handleChange} style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }} autoComplete={tab === 'login' ? 'current-password' : 'new-password'} />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.9rem', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
              {loading ? (tab === 'login' ? 'Signing in...' : 'Creating account...') : (
                tab === 'login' ? <><span>Sign In</span> <ArrowRight size={15} /></> : <><span>Create Account</span> <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>

          {/* OAuth Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => handleOAuth('github')} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </button>
            <button onClick={() => handleOAuth('google')} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          ← <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#60a5fa', fontSize: '0.75rem' }}>Back to Home</button>
        </p>
      </div>
    </div>
  )
}
