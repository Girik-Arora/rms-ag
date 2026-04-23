import { useAuthStore } from '@/store/authStore'
import StatsCard from '@/components/shared/StatsCard'
import { BookOpen, TrendingUp, Award, Clock, ChevronRight, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const mockSgpaData = [
  { sem: 'Sem 1', sgpa: 7.2 },
  { sem: 'Sem 2', sgpa: 7.8 },
  { sem: 'Sem 3', sgpa: 8.1 },
  { sem: 'Sem 4', sgpa: 8.4 },
  { sem: 'Sem 5', sgpa: 8.76 },
]

const mockRecentResults = [
  { subject: 'Engineering Mathematics V', ise: 42, ese: 71, total: 113, max: 150, grade: 'A' },
  { subject: 'Data Structures & Algorithms', ise: 46, ese: 83, total: 129, max: 150, grade: 'O' },
  { subject: 'Database Management Systems', ise: 38, ese: 87, total: 125, max: 150, grade: 'O' },
  { subject: 'Computer Networks', ise: 40, ese: 64, total: 104, max: 150, grade: 'B+' },
  { subject: 'Software Engineering', ise: 44, ese: 78, total: 122, max: 150, grade: 'A+' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="glass" style={{ padding: '0.75rem 1rem', borderRadius: 10 }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
        {payload[0].value}
      </div>
    </div>
  )
  return null
}

const gradeColor = { O: '#10b981', 'A+': '#10b981', A: '#3b82f6', 'B+': '#3b82f6', B: '#f59e0b', C: '#94a3b8', F: '#ef4444' }

export default function StudentDashboard() {
  const { profile } = useAuthStore()
  const cgpa = 8.06
  const currentSem = 'Semester 5 (TE)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.08))',
        border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: 16, padding: '1.5rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600, marginBottom: 4 }}>
            {currentSem} · IT Branch
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>
            Welcome back, {profile?.name?.split(' ')[0] || 'Student'} 🎓
          </h1>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            Enrollment: <span style={{ fontFamily: 'var(--font-mono)', color: '#60a5fa' }}>{profile?.enrollmentNo || 'EN21IT001'}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current CGPA</div>
          <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#34d399', lineHeight: 1 }}>{cgpa}</div>
          <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: 2 }}>↑ +0.32 this semester</div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatsCard title="Current SGPA" value="8.76" subtitle="Semester 5" icon={Award} color="green" trend="up" trendValue="+0.36 vs last sem" />
        <StatsCard title="CGPA" value="8.06" subtitle="All semesters" icon={TrendingUp} color="blue" trend="up" trendValue="+0.32" />
        <StatsCard title="Subjects" value="6" subtitle="This semester" icon={BookOpen} color="purple" />
        <StatsCard title="Backlogs" value="0" subtitle="Active" icon={Clock} color="green" />
      </div>

      {/* SGPA Chart + Recent Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.25rem' }}>
        {/* SGPA Trend */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>SGPA Trend</h2>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>All semesters</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={mockSgpaData} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="sgpaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
              <XAxis dataKey="sem" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[6, 10]} tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sgpa" stroke="#3b82f6" strokeWidth={2.5} fill="url(#sgpaGrad)" dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#60a5fa' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Results */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>Semester 5 Results</h2>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>ESE · Current semester</div>
            </div>
            <button className="btn-ghost" style={{ padding: '0.3rem 0.75rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 4 }}>
              View All <ChevronRight size={12} />
            </button>
          </div>
          <div>
            {mockRecentResults.map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.6rem 0',
                borderBottom: i < mockRecentResults.length - 1 ? '1px solid var(--color-border)' : 'none',
                gap: '0.5rem',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.subject}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>
                    ISE: {r.ise} · ESE: {r.ese}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700 }}>{r.total}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>/{r.max}</div>
                  </div>
                  <span className={`grade-chip grade-${r.grade === 'O' || r.grade === 'A+' ? 'O' : r.grade.startsWith('A') ? 'A' : r.grade.startsWith('B') ? 'B' : 'C'}`}>
                    {r.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exam Schedule hint */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Calendar size={20} color="#f59e0b" />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>ISE-2 Exams Approaching</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Prepare well — ISE-2 marks are available after faculty entry</div>
        </div>
        <button className="btn-ghost" style={{ marginLeft: 'auto', padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
          View Schedule
        </button>
      </div>
    </div>
  )
}
