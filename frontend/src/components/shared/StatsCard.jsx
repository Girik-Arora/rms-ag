import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function StatsCard({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'blue', loading }) {
  const colors = {
    blue:  { bg: 'rgba(59,130,246,0.1)',  icon: '#3b82f6', border: 'rgba(59,130,246,0.2)'  },
    green: { bg: 'rgba(16,185,129,0.1)',  icon: '#10b981', border: 'rgba(16,185,129,0.2)'  },
    gold:  { bg: 'rgba(245,158,11,0.1)',  icon: '#f59e0b', border: 'rgba(245,158,11,0.2)'  },
    red:   { bg: 'rgba(239,68,68,0.1)',   icon: '#ef4444', border: 'rgba(239,68,68,0.2)'   },
    purple:{ bg: 'rgba(139,92,246,0.1)',  icon: '#8b5cf6', border: 'rgba(139,92,246,0.2)'  },
  }
  const c = colors[color] || colors.blue

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#94a3b8'

  if (loading) {
    return (
      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 36, width: '40%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, width: '80%' }} />
      </div>
    )
  }

  return (
    <div className="card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 100, height: 100,
        background: c.bg,
        borderRadius: '50%',
        filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {title}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1, marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
            {value ?? '—'}
          </div>
          {subtitle && (
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{subtitle}</div>
          )}
          {trend && trendValue && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
              <TrendIcon size={13} color={trendColor} />
              <span style={{ fontSize: '0.7rem', color: trendColor, fontWeight: 600 }}>{trendValue}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div style={{
            width: 44, height: 44,
            background: c.bg,
            border: `1px solid ${c.border}`,
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={20} color={c.icon} />
          </div>
        )}
      </div>
    </div>
  )
}
