import { Bell, Menu, Search } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'

export default function Navbar({ onMenuToggle }) {
  const { profile } = useAuthStore()
  const [searchFocused, setSearchFocused] = useState(false)

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening'

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 0 1.5rem 0',
      borderBottom: '1px solid var(--color-border)',
      marginBottom: '0.5rem',
      gap: '1rem',
    }}>
      {/* Left: Greeting + hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onMenuToggle}
          style={{
            display: 'none', background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--color-text-secondary)',
            padding: '0.25rem',
          }}
          className="mobile-menu-btn"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {greeting},
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
            {profile?.name?.split(' ')[0] || 'Welcome'} 👋
          </div>
        </div>
      </div>

      {/* Right: Search + Notifications */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Search bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: searchFocused ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${searchFocused ? 'rgba(59,130,246,0.4)' : 'var(--color-border)'}`,
          borderRadius: '10px',
          padding: '0.5rem 0.875rem',
          transition: 'all 0.2s ease',
          width: searchFocused ? 260 : 200,
        }}>
          <Search size={14} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: 'var(--color-text-primary)', fontSize: '0.825rem',
              width: '100%', fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        {/* Notification bell */}
        <button style={{
          position: 'relative',
          width: 38, height: 38,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--color-border)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s ease',
          color: 'var(--color-text-secondary)',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; e.currentTarget.style.color = '#60a5fa' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}
        >
          <Bell size={16} />
          <span style={{
            position: 'absolute', top: 7, right: 8,
            width: 7, height: 7,
            background: '#3b82f6', borderRadius: '50%',
            border: '1.5px solid var(--color-bg-base)',
          }} />
        </button>
      </div>
    </header>
  )
}
