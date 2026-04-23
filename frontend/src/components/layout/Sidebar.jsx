import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import {
  LayoutDashboard, FileText, Upload, Users,
  ClipboardList, BarChart3, BookOpen, LogOut,
  GraduationCap, X
} from 'lucide-react'

const navItems = {
  STUDENT: [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/results',   icon: FileText,         label: 'My Results' },
    { to: '/student/gazette',   icon: Upload,           label: 'Gazette Reader' },
  ],
  FACULTY: [
    { to: '/faculty/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/faculty/marks',     icon: ClipboardList,   label: 'Mark Entry' },
  ],
  HOD: [
    { to: '/hod/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/hod/results',   icon: Users,            label: 'Branch Results' },
    { to: '/hod/reports',   icon: BarChart3,        label: 'Reports & Analytics' },
  ],
}

const roleLabel = { STUDENT: 'Student', FACULTY: 'Faculty', HOD: 'Head of Department' }
const roleColor = { STUDENT: '#3b82f6', FACULTY: '#10b981', HOD: '#f59e0b' }

export default function Sidebar({ role, isOpen, onClose }) {
  const navigate = useNavigate()
  const { user, profile, logout } = useAuthStore()
  const items = navItems[role] || []
  const [signingOut, setSigningOut] = useState(false)

  const handleLogout = async () => {
    setSigningOut(true)
    try {
      await logout()          // waits for supabase.auth.signOut() to finish
      navigate('/login')
    } catch (err) {
      console.error('Sign out error:', err)
      setSigningOut(false)    // re-enable button if it fails
    }
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 38, height: 38,
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <GraduationCap size={20} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
                RMS<span style={{ color: '#3b82f6' }}>·AG</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Result Portal
              </div>
            </div>
          </div>
          {/* Mobile close */}
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'none' }} className="mobile-close">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: `linear-gradient(135deg, ${roleColor[role]}, rgba(${roleColor[role]},0.5))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 700, color: 'white',
            flexShrink: 0,
            background: roleColor[role] === '#3b82f6'
              ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
              : roleColor[role] === '#10b981'
                ? 'linear-gradient(135deg, #10b981, #06b6d4)'
                : 'linear-gradient(135deg, #f59e0b, #ef4444)',
          }}>
            {(profile?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.name || 'User'}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '1px 8px', borderRadius: 20,
              background: `${roleColor[role]}20`,
              color: roleColor[role],
              fontSize: '0.65rem', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              marginTop: 2,
            }}>
              {roleLabel[role]}
            </div>
          </div>
        </div>
        {profile?.enrollmentNo && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            {profile.enrollmentNo}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflow: 'auto' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
          Navigation
        </div>
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: Logout */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--color-border)' }}>
        <button
          onClick={handleLogout}
          disabled={signingOut}
          className="sidebar-nav-item"
          style={{
            width: '100%', background: 'none', border: 'none',
            cursor: signingOut ? 'not-allowed' : 'pointer',
            color: 'var(--color-text-muted)',
            opacity: signingOut ? 0.5 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          <LogOut size={16} style={{ animation: signingOut ? 'spin 1s linear infinite' : 'none' }} />
          {signingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </aside>
  )
}
