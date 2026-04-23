import StatsCard from '@/components/shared/StatsCard'
import { useAuthStore } from '@/store/authStore'
import { Users, TrendingUp, Award, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const branchStats = [
  { branch: 'IT',    avgSgpa: 8.2, passRate: 94, students: 63  },
  { branch: 'COMP',  avgSgpa: 8.5, passRate: 97, students: 71  },
  { branch: 'EXTC',  avgSgpa: 7.9, passRate: 91, students: 58  },
  { branch: 'ECS',   avgSgpa: 7.6, passRate: 88, students: 45  },
  { branch: 'MECH',  avgSgpa: 7.4, passRate: 85, students: 62  },
  { branch: 'AIDS',  avgSgpa: 8.6, passRate: 96, students: 48  },
  { branch: 'AIML',  avgSgpa: 8.7, passRate: 98, students: 50  },
  { branch: 'CSE',   avgSgpa: 8.8, passRate: 99, students: 56  },
]

const BarTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="glass" style={{ padding: '0.75rem 1rem', borderRadius: 10 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: '0.8rem', color: '#60a5fa' }}>Avg SGPA: {payload[0]?.value}</div>
      {payload[1] && <div style={{ fontSize: '0.8rem', color: '#34d399' }}>Pass Rate: {payload[1]?.value}%</div>}
    </div>
  )
  return null
}

export default function HodDashboard() {
  const { profile } = useAuthStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.05))',
        border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: 16, padding: '1.5rem 2rem',
      }}>
        <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600, marginBottom: 4 }}>Head of Department</div>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>
          Department Overview 📊
        </h1>
        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
          Semester 5 (Odd) · Academic Year 2024–25
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <StatsCard title="Total Students" value={branchStats.reduce((s, b) => s + b.students, 0)} icon={Users} color="blue" />
        <StatsCard title="Branches Active" value={branchStats.length} icon={Award} color="gold" />
        <StatsCard title="Avg SGPA (IT)" value="8.2" icon={TrendingUp} color="green" trend="up" trendValue="+0.3 vs last sem" />
        <StatsCard title="Avg Pass Rate" value={`${(branchStats.reduce((s, b) => s + b.passRate, 0) / branchStats.length).toFixed(0)}%`} icon={AlertCircle} color="green" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* SGPA by Branch */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', fontWeight: 700 }}>Average SGPA by Branch</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={branchStats} margin={{ left: -15, right: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
              <XAxis dataKey="branch" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[7, 10]} tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="avgSgpa" radius={[6, 6, 0, 0]}>
                {branchStats.map((entry, i) => (
                  <Cell key={i} fill={entry.avgSgpa >= 8.5 ? '#10b981' : entry.avgSgpa >= 8 ? '#3b82f6' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pass Rate by Branch */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', fontWeight: 700 }}>Pass Rate by Branch (%)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={branchStats} margin={{ left: -15, right: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
              <XAxis dataKey="branch" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[75, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="passRate" radius={[6, 6, 0, 0]}>
                {branchStats.map((entry, i) => (
                  <Cell key={i} fill={entry.passRate >= 95 ? '#10b981' : entry.passRate >= 90 ? '#3b82f6' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>Branch Performance Summary</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--color-border)' }}>
              {['Branch', 'Students', 'Avg SGPA', 'Pass Rate', 'Status'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {branchStats.map((b, i) => (
              <tr key={b.branch} style={{ borderBottom: '1px solid var(--color-border)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>{b.branch}</td>
                <td style={{ padding: '0.875rem 1rem', fontFamily: 'var(--font-mono)' }}>{b.students}</td>
                <td style={{ padding: '0.875rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: b.avgSgpa >= 8.5 ? '#34d399' : b.avgSgpa >= 8 ? '#60a5fa' : '#fbbf24' }}>{b.avgSgpa}</td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, maxWidth: 100, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${b.passRate}%`, background: b.passRate >= 95 ? '#10b981' : b.passRate >= 90 ? '#3b82f6' : '#f59e0b', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{b.passRate}%</span>
                  </div>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span className={b.passRate >= 90 ? 'pass-pill' : 'fail-pill'}>{b.passRate >= 90 ? 'GOOD' : 'REVIEW'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
