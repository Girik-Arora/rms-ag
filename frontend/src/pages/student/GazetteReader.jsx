import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, Download, X } from 'lucide-react'
import GradeChip, { PassFailBadge } from '@/components/shared/GradeChip'

// ─── Mock extraction result ─────────────────────────────────────────────────
const mockExtracted = {
  studentName: 'Rahul Sharma',
  enrollmentNo: 'EN21IT001',
  branch: 'Information Technology',
  semester: 'Semester 5',
  examType: 'ESE (End Semester Examination)',
  confidence: 98.4,
  subjects: [
    { code: 'ITC501', name: 'Engineering Mathematics V',      ise: 42, ese: 71, total: 113, max: 150, grade: 'A',  pass: true  },
    { code: 'ITC502', name: 'Data Structures & Algorithms',  ise: 46, ese: 83, total: 129, max: 150, grade: 'O',  pass: true  },
    { code: 'ITC503', name: 'Database Management Systems',   ise: 38, ese: 87, total: 125, max: 150, grade: 'O',  pass: true  },
    { code: 'ITC504', name: 'Computer Networks',              ise: 40, ese: 64, total: 104, max: 150, grade: 'B+', pass: true  },
    { code: 'ITL501', name: 'DBMS Lab',                       ise: 49, ese: 40, total: 89,  max: 125, grade: 'O',  pass: true  },
  ],
  sgpa: 8.76,
  cgpa: 8.06,
  result: 'PASSED',
}

const STAGES = [
  { id: 'upload',    label: 'Uploading PDF',          icon: Upload         },
  { id: 'extract',   label: 'Extracting Text',         icon: FileText       },
  { id: 'parse',     label: 'Parsing Tables',          icon: Sparkles       },
  { id: 'calculate', label: 'Calculating SGPA/CGPA',   icon: CheckCircle2   },
]

export default function GazetteReader() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | processing | done | error
  const [currentStage, setCurrentStage] = useState(0)
  const [uploadPct, setUploadPct] = useState(0)
  const [result, setResult] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0]
    if (!f) return
    if (f.type !== 'application/pdf') { alert('Please upload a PDF file'); return }
    setFile(f)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: status === 'processing',
  })

  const handleProcess = async () => {
    if (!file) return
    setStatus('processing')
    setCurrentStage(0)
    setUploadPct(0)

    // Simulate upload progress
    for (let p = 0; p <= 100; p += 10) {
      await new Promise(r => setTimeout(r, 60))
      setUploadPct(p)
    }
    // Simulate processing stages
    for (let s = 1; s < STAGES.length; s++) {
      await new Promise(r => setTimeout(r, 900))
      setCurrentStage(s)
    }
    await new Promise(r => setTimeout(r, 600))
    setResult(mockExtracted)
    setStatus('done')
  }

  const reset = () => { setFile(null); setStatus('idle'); setResult(null); setCurrentStage(0); setUploadPct(0) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 900 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Gazette Reader</h1>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: 2 }}>
          Upload your result gazette PDF — our parser extracts marks instantly
        </div>
      </div>

      {/* Drop Zone */}
      {status !== 'done' && (
        <div
          {...getRootProps()}
          style={{
            border: `2px dashed ${isDragActive ? '#3b82f6' : file ? '#10b981' : 'var(--color-border-strong)'}`,
            borderRadius: 16, padding: '3rem 2rem',
            textAlign: 'center', cursor: status === 'processing' ? 'not-allowed' : 'pointer',
            background: isDragActive ? 'rgba(59,130,246,0.05)' : file ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.02)',
            transition: 'all 0.25s ease',
          }}
        >
          <input {...getInputProps()} />
          {file ? (
            <>
              <FileText size={40} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontWeight: 700, color: '#34d399', fontSize: '1rem', marginBottom: 4 }}>{file.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {(file.size / 1024).toFixed(1)} KB · Click to change
              </div>
            </>
          ) : (
            <>
              <Upload size={40} color={isDragActive ? '#3b82f6' : 'var(--color-text-muted)'} style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: isDragActive ? '#60a5fa' : 'var(--color-text-primary)', marginBottom: 4 }}>
                {isDragActive ? 'Drop your gazette here' : 'Drag & drop your gazette PDF'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                or <span style={{ color: '#60a5fa' }}>click to browse</span> · PDF files only
              </div>
            </>
          )}
        </div>
      )}

      {/* Processing Pipeline */}
      {status === 'processing' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
            <Loader2 size={16} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Processing your gazette...</span>
          </div>

          {/* Upload progress */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
              <span>Uploading PDF</span><span>{uploadPct}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${uploadPct}%`, background: 'linear-gradient(90deg, #3b82f6, #6366f1)', borderRadius: 3, transition: 'width 0.1s linear' }} />
            </div>
          </div>

          {/* Stages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {STAGES.map((stage, i) => {
              const done = i < currentStage
              const active = i === currentStage
              const Icon = stage.icon
              return (
                <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: done ? 'rgba(16,185,129,0.15)' : active ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : active ? 'rgba(59,130,246,0.3)' : 'var(--color-border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'all 0.3s ease',
                  }}>
                    {active
                      ? <Loader2 size={14} color="#60a5fa" style={{ animation: 'spin 1s linear infinite' }} />
                      : <Icon size={14} color={done ? '#34d399' : 'var(--color-text-muted)'} />
                    }
                  </div>
                  <div style={{ fontSize: '0.825rem', color: done ? '#34d399' : active ? '#60a5fa' : 'var(--color-text-muted)', fontWeight: active ? 600 : 400 }}>
                    {stage.label} {done && '✓'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Process Button */}
      {status === 'idle' && file && (
        <button className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: '0.9rem', padding: '0.75rem 1.5rem' }} onClick={handleProcess}>
          <Sparkles size={16} /> Extract Marks from Gazette
        </button>
      )}

      {/* Extracted Results */}
      {status === 'done' && result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Success Banner */}
          <div style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: 14, padding: '1.25rem 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 size={22} color="#10b981" />
              <div>
                <div style={{ fontWeight: 700, color: '#34d399' }}>Extraction Successful!</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Confidence: {result.confidence}% · {result.subjects.length} subjects extracted
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}><Download size={13} /> Save to Profile</button>
              <button onClick={reset} className="btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}><X size={13} /></button>
            </div>
          </div>

          {/* Student Header */}
          <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{result.studentName}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{result.enrollmentNo}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                {result.branch} · {result.semester} · {result.examType}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>SGPA</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#60a5fa', lineHeight: 1 }}>{result.sgpa}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CGPA</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#34d399', lineHeight: 1 }}>{result.cgpa}</div>
              </div>
            </div>
          </div>

          {/* Marks Table */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700 }}>Extracted Marks</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.02)' }}>
                    {['Code', 'Subject', 'ISE', 'ESE', 'Total', 'Max', 'Grade', 'Status'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.subjects.map((s, i) => (
                    <tr key={s.code} style={{ borderBottom: '1px solid var(--color-border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '0.875rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#60a5fa' }}>{s.code}</td>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>{s.name}</td>
                      <td style={{ padding: '0.875rem 1rem', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>{s.ise}</td>
                      <td style={{ padding: '0.875rem 1rem', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>{s.ese}</td>
                      <td style={{ padding: '0.875rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 800, textAlign: 'center' }}>{s.total}</td>
                      <td style={{ padding: '0.875rem 1rem', fontFamily: 'var(--font-mono)', textAlign: 'center', color: 'var(--color-text-muted)' }}>{s.max}</td>
                      <td style={{ padding: '0.875rem 1rem' }}><GradeChip grade={s.grade} /></td>
                      <td style={{ padding: '0.875rem 1rem' }}><PassFailBadge pass={s.pass} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
