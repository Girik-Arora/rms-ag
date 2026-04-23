import { useState } from 'react'
import { Save, ChevronDown, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const subjects = [
  { code: 'ITC502', name: 'Data Structures & Algorithms', branch: 'IT', sem: 5 },
  { code: 'ITC503', name: 'Database Management Systems',  branch: 'IT', sem: 5 },
  { code: 'CTC401', name: 'Computer Organization',        branch: 'COMP', sem: 4 },
]

const examTypes = ['ISE-1', 'ISE-2', 'ISE-3/IE', 'ESE']

const mockStudents = Array.from({ length: 12 }, (_, i) => ({
  id: `S${String(i + 1).padStart(3, '0')}`,
  rollNo: String(i + 1).padStart(2, '0'),
  name: ['Amit Sharma', 'Priya Patel', 'Ravi Kumar', 'Sneha Joshi', 'Vikram Singh',
         'Kavya Mehta', 'Rohan Gupta', 'Ananya Iyer', 'Deepak Rao', 'Pooja Nair',
         'Arjun Verma', 'Simran Kaur'][i],
  enrollment: `EN21IT0${String(i + 1).padStart(2, '0')}`,
  marks: '',
}))

export default function MarkEntry() {
  const [selectedSub, setSelectedSub] = useState(subjects[0].code)
  const [selectedExam, setSelectedExam] = useState('ISE-1')
  const [students, setStudents] = useState(mockStudents)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  const maxMarks = selectedExam === 'ESE' ? 100 : 25
  const sub = subjects.find(s => s.code === selectedSub)
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.enrollment.toLowerCase().includes(search.toLowerCase())
  )

  const updateMark = (id, val) => {
    const num = val === '' ? '' : Math.min(Math.max(0, Number(val)), maxMarks)
    setStudents(prev => prev.map(s => s.id === id ? { ...s, marks: val === '' ? '' : num } : s))
  }

  const handleSave = async () => {
    const invalid = students.filter(s => s.marks !== '' && (isNaN(s.marks) || s.marks < 0 || s.marks > maxMarks))
    if (invalid.length) { toast.error(`Marks must be between 0 and ${maxMarks}`); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    toast.success('Marks saved successfully!')
  }

  const filled = students.filter(s => s.marks !== '' && !isNaN(s.marks)).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Mark Entry</h1>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Enter student marks per exam type</div>
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
          <Save size={15} /> {saving ? 'Saving...' : 'Save Marks'}
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <label style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: 4, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subject</label>
          <select
            value={selectedSub}
            onChange={e => setSelectedSub(e.target.value)}
            className="input-field"
            style={{ appearance: 'none', cursor: 'pointer' }}
          >
            {subjects.map(s => <option key={s.code} value={s.code}>{s.code} · {s.name}</option>)}
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: 12, bottom: 11, color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
        </div>
        <div style={{ flex: '0 0 auto', minWidth: 160 }}>
          <label style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: 4, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Exam Type</label>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {examTypes.map(e => (
              <button key={e} onClick={() => setSelectedExam(e)} style={{
                padding: '0.5rem 0.75rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600,
                cursor: 'pointer', border: '1px solid', transition: 'all 0.15s ease',
                background: selectedExam === e ? 'rgba(59,130,246,0.2)' : 'transparent',
                borderColor: selectedExam === e ? 'rgba(59,130,246,0.4)' : 'var(--color-border)',
                color: selectedExam === e ? '#60a5fa' : 'var(--color-text-muted)',
              }}>{e}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
        background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 12, padding: '0.875rem 1.25rem',
      }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Subject: </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#60a5fa' }}>{sub?.name}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Exam: </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{selectedExam}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Max Marks: </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{maxMarks}</span>
          </div>
        </div>
        <div style={{ fontSize: '0.8rem', color: filled === students.length ? '#10b981' : 'var(--color-text-muted)' }}>
          {filled}/{students.length} entries filled
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 300 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <input className="input-field" placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem' }} />
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Roll No</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Student Name</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Enrollment No</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Marks (/{maxMarks})
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const val = s.marks
              const isOver = val !== '' && !isNaN(val) && Number(val) > maxMarks
              const isGood = val !== '' && !isNaN(val) && !isOver
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{s.rollNo}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#60a5fa' }}>{s.enrollment}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <input
                      type="number" min={0} max={maxMarks}
                      value={s.marks}
                      onChange={e => updateMark(s.id, e.target.value)}
                      placeholder="—"
                      style={{
                        width: 80, textAlign: 'center',
                        background: isOver ? 'rgba(239,68,68,0.08)' : isGood ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isOver ? 'rgba(239,68,68,0.4)' : isGood ? 'rgba(16,185,129,0.3)' : 'var(--color-border)'}`,
                        borderRadius: 8, color: 'var(--color-text-primary)',
                        padding: '0.4rem 0.5rem', fontSize: '0.875rem',
                        fontFamily: 'var(--font-mono)', fontWeight: 700,
                        outline: 'none', transition: 'all 0.15s ease',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                      onBlur={e => e.target.style.borderColor = isOver ? 'rgba(239,68,68,0.4)' : isGood ? 'rgba(16,185,129,0.3)' : 'var(--color-border)'}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
