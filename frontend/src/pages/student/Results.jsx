import { useState } from 'react'
import GradeChip, { PassFailBadge } from '@/components/shared/GradeChip'
import { Filter, Download, ChevronDown } from 'lucide-react'

const semesters = [
  { id: 1, label: 'Semester 1 (FE - Odd)', year: 'FE', sgpa: 7.20 },
  { id: 2, label: 'Semester 2 (FE - Even)', year: 'FE', sgpa: 7.80 },
  { id: 3, label: 'Semester 3 (SE - Odd)', year: 'SE', sgpa: 8.10 },
  { id: 4, label: 'Semester 4 (SE - Even)', year: 'SE', sgpa: 8.40 },
  { id: 5, label: 'Semester 5 (TE - Odd)', year: 'TE', sgpa: 8.76 },
]

const resultData = {
  1: [
    { code: 'FEC101', name: 'Engineering Mathematics I', credits: 4, ise1: 18, ise2: 19, ese: 62, total: 99, max: 150, grade: 'B+', pass: true },
    { code: 'FEC102', name: 'Engineering Physics',        credits: 3, ise1: 16, ise2: 18, ese: 56, total: 90, max: 150, grade: 'B',  pass: true },
    { code: 'FEC103', name: 'Engineering Chemistry',      credits: 3, ise1: 17, ise2: 16, ese: 60, total: 93, max: 150, grade: 'B+', pass: true },
    { code: 'FEC104', name: 'C Programming',              credits: 4, ise1: 20, ise2: 22, ese: 74, total: 116,max: 150, grade: 'A',  pass: true },
    { code: 'FEC105', name: 'Engineering Drawing',        credits: 2, ise1: 15, ise2: 17, ese: 55, total: 87, max: 150, grade: 'B',  pass: true },
  ],
  5: [
    { code: 'ITC501', name: 'Engineering Mathematics V',       credits: 4, ise1: 20, ise2: 22, ese: 71, total: 113, max: 150, grade: 'A',  pass: true },
    { code: 'ITC502', name: 'Data Structures & Algorithms',   credits: 4, ise1: 24, ise2: 22, ese: 83, total: 129, max: 150, grade: 'O',  pass: true },
    { code: 'ITC503', name: 'Database Management Systems',    credits: 4, ise1: 19, ise2: 19, ese: 87, total: 125, max: 150, grade: 'O',  pass: true },
    { code: 'ITC504', name: 'Computer Networks',               credits: 3, ise1: 20, ise2: 20, ese: 64, total: 104, max: 150, grade: 'B+', pass: true },
    { code: 'ITL501', name: 'DBMS Lab',                        credits: 2, ise1: 24, ise2: 25, ese: 40, total: 89,  max: 125, grade: 'O',  pass: true },
    { code: 'ITE501', name: 'Summer Internship',               credits: 2, ise1: null, ise2: null, ese: null, total: null, max: null, grade: 'O', pass: true, isSpecial: true, specialType: 'Internship' },
  ],
}

export default function StudentResults() {
  const [selectedSem, setSelectedSem] = useState(5)
  const [showFilter, setShowFilter] = useState(false)

  const sem = semesters.find(s => s.id === selectedSem)
  const results = resultData[selectedSem] || resultData[5]
  const regular = results.filter(r => !r.isSpecial)
  const special = results.filter(r => r.isSpecial)

  const totalObtained = regular.reduce((s, r) => s + (r.total || 0), 0)
  const totalMax = regular.reduce((s, r) => s + (r.max || 0), 0)
  const pct = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>My Results</h1>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>View all semester marks</div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* Semester Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {semesters.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSem(s.id)}
            style={{
              padding: '0.5rem 1rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s ease', border: '1px solid',
              background: selectedSem === s.id ? 'rgba(59,130,246,0.2)' : 'transparent',
              borderColor: selectedSem === s.id ? 'rgba(59,130,246,0.4)' : 'var(--color-border)',
              color: selectedSem === s.id ? '#60a5fa' : 'var(--color-text-muted)',
            }}
          >
            {s.year} · Sem {s.id}
          </button>
        ))}
      </div>

      {/* SGPA Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>SGPA</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#60a5fa' }}>{sem?.sgpa || '—'}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{sem?.label}</div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Marks</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{totalObtained}<span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>/{totalMax}</span></div>
          <div style={{ fontSize: '0.7rem', color: '#10b981' }}>{pct}% overall</div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subjects</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{regular.length}</div>
          <div style={{ fontSize: '0.7rem', color: '#10b981' }}>All passed ✓</div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>CGPA</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#34d399' }}>8.06</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Cumulative</div>
        </div>
      </div>

      {/* Results Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>Subject-wise Marks · {sem?.label}</h2>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            ISE-1 + ISE-2 = Internal (50) · ESE = External (100)
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Code', 'Subject', 'Credits', 'ISE-1', 'ISE-2', 'Internal', 'ESE', 'Total', 'Grade', 'Status'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.02)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {regular.map((r, i) => {
                const internal = (r.ise1 || 0) + (r.ise2 || 0)
                return (
                  <tr key={r.code} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '0.875rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#60a5fa' }}>{r.code}</td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600, maxWidth: 220 }}>{r.name}</td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>{r.credits}</td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{r.ise1 ?? '—'}</td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{r.ise2 ?? '—'}</td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{internal}/50</td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{r.ese ?? '—'}/100</td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                      {r.total}/{r.max}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}><GradeChip grade={r.grade} /></td>
                    <td style={{ padding: '0.875rem 1rem' }}><PassFailBadge pass={r.pass} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Special Results */}
      {special.length > 0 && (
        <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700 }}>Internship & Industry Practice</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {special.map(s => (
              <div key={s.code} style={{
                background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 12, padding: '1rem 1.25rem', minWidth: 200,
              }}>
                <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>{s.specialType}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 8 }}>{s.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <GradeChip grade={s.grade} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Grade · {s.credits} Credits</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
