import StatsCard from '@/components/shared/StatsCard'
import { useAuthStore } from '@/store/authStore'
import { ClipboardList, Users, CheckCircle2, AlertCircle, ChevronRight, BookOpen } from 'lucide-react'

const mockSubjects = [
  { code: 'ITC502', name: 'Data Structures & Algorithms', branch: 'IT', year: 'TE', sem: 5, students: 63, ise1Done: true,  ise2Done: true,  eseDone: true  },
  { code: 'ITC503', name: 'Database Management Systems',  branch: 'IT', year: 'TE', sem: 5, students: 63, ise1Done: true,  ise2Done: false, eseDone: false },
  { code: 'CTC401', name: 'Computer Organization',        branch: 'COMP', year: 'SE', sem: 4, students: 71, ise1Done: false, ise2Done: false, eseDone: false },
]

const pending = mockSubjects.filter(s => !s.ise1Done || !s.ise2Done || !s.eseDone)

export default function FacultyDashboard() {
  const { profile } = useAuthStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.06))',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 16, padding: '1.5rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600, marginBottom: 4 }}>Faculty Dashboard</div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>
            Welcome, {profile?.name?.split(' ')[0] || 'Faculty'} 👋
          </h1>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            You have {pending.length} subject(s) with pending mark entries
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <StatsCard title="Assigned Subjects" value={mockSubjects.length} icon={BookOpen} color="green" />
        <StatsCard title="Total Students" value={mockSubjects.reduce((s, x) => s + x.students, 0)} icon={Users} color="blue" />
        <StatsCard title="Mark Entries Pending" value={pending.length} icon={AlertCircle} color="gold" />
        <StatsCard title="Completed" value={mockSubjects.filter(s => s.ise1Done && s.ise2Done && s.eseDone).length} icon={CheckCircle2} color="green" />
      </div>

      {/* Subject Cards */}
      <div>
        <h2 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700 }}>Your Assigned Subjects</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mockSubjects.map(s => (
            <div key={s.code} className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#60a5fa' }}>{s.code}</span>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(16,185,129,0.1)', color: '#34d399', padding: '1px 8px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)' }}>
                    {s.branch} · {s.year} · Sem {s.sem}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{s.students} students enrolled</div>
              </div>

              {/* Status chips */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'ISE-1', done: s.ise1Done },
                  { label: 'ISE-2', done: s.ise2Done },
                  { label: 'ESE',   done: s.eseDone  },
                ].map(({ label, done }) => (
                  <span key={label} style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600,
                    background: done ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                    border: `1px solid ${done ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                    color: done ? '#34d399' : '#fbbf24',
                  }}>
                    {done ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                    {label}
                  </span>
                ))}
              </div>

              <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                Enter Marks <ChevronRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
