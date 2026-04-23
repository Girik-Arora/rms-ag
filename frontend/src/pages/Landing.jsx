import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  GraduationCap, BarChart3, Upload, Shield, Zap,
  Users, Award, ArrowRight, CheckCircle2, Star,
  BookOpen, TrendingUp, FileSearch
} from 'lucide-react'

const branches = ['IT', 'COMP', 'EXTC', 'ECS', 'MECH', 'MME', 'AIDS', 'AIML', 'IoT', 'CSE', 'CIVIL']

const features = [
  {
    icon: BarChart3,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
    title: 'Smart Result Dashboard',
    desc: 'View SGPA, CGPA, subject-wise marks, and performance trends — all in one glance.',
  },
  {
    icon: FileSearch,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    title: 'AI Gazette Reader',
    desc: 'Upload your result gazette PDF and let our intelligent parser extract all marks instantly.',
  },
  {
    icon: Shield,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)',
    title: 'Role-Based Access',
    desc: 'Separate secure portals for Students, Faculty, and Head of Department.',
  },
  {
    icon: Zap,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    title: 'Real-Time Sync',
    desc: 'Faculty enter marks and students see updates instantly — no delays, no manual distribution.',
  },
  {
    icon: TrendingUp,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    title: 'Performance Analytics',
    desc: 'HoD gets branch-wide insights, pass-fail ratios, and top-performer reports.',
  },
  {
    icon: BookOpen,
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.1)',
    title: 'Complete Exam Coverage',
    desc: 'ISE-1, ISE-2, ISE-3/IE, ESE, Summer Internship, Industry Practice — all covered.',
  },
]

const stats = [
  { value: '11', label: 'Engineering Branches', suffix: '' },
  { value: '8',  label: 'Semesters Tracked',     suffix: '' },
  { value: '4',  label: 'Exam Types',             suffix: '+' },
  { value: '99', label: 'Uptime Guarantee',       suffix: '%' },
]

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const end = parseInt(target)
    const duration = 2000
    const step = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      start = Math.min(start + step, end)
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <>{count}{suffix}</>
}

export default function Landing() {
  const navigate = useNavigate()
  const [activeBranch, setActiveBranch] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActiveBranch(i => (i + 1) % branches.length), 1200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)' }}>

      {/* ─── NAV ─────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(7,12,26,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GraduationCap size={20} color="white" />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
              RMS<span style={{ color: '#3b82f6' }}>·AG</span>
            </span>
            <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Result Management System
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-ghost" onClick={() => navigate('/login')}>
            Sign In
          </button>
          <button className="btn-primary" onClick={() => navigate('/login')}>
            Get Started <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────────────── */}
      <section className="mesh-bg" style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '8rem 2rem 4rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.25)',
          borderRadius: 100, padding: '6px 16px',
          marginBottom: '2rem',
          animation: 'fadeSlideIn 0.6s ease',
        }}>
          <span style={{ width: 6, height: 6, background: '#3b82f6', borderRadius: '50%' }} />
          <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600 }}>
            Now live for all engineering branches
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 900, lineHeight: 1.1,
          maxWidth: 820, marginBottom: '1.5rem',
          animation: 'fadeSlideIn 0.7s ease 0.1s both',
        }}>
          Your College Results,{' '}
          <span className="gradient-text">Reimagined.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--color-text-secondary)',
          maxWidth: 600, marginBottom: '2.5rem',
          lineHeight: 1.7,
          animation: 'fadeSlideIn 0.7s ease 0.2s both',
        }}>
          One platform for Students, Faculty, and HoD — manage marks, track SGPA/CGPA,
          and extract results from gazette PDFs instantly.
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem', animation: 'fadeSlideIn 0.7s ease 0.3s both' }}>
          <button
            className="btn-primary"
            style={{ fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: 12 }}
            onClick={() => navigate('/login')}
          >
            Access Portal <ArrowRight size={16} />
          </button>
          <button
            className="btn-ghost"
            style={{ fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: 12 }}
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </button>
        </div>

        {/* Branches ticker */}
        <div style={{ animation: 'fadeSlideIn 0.7s ease 0.4s both' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Covering all branches
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {branches.map((b, i) => (
              <span key={b} style={{
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: '0.75rem', fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                background: i === activeBranch ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${i === activeBranch ? 'rgba(59,130,246,0.4)' : 'var(--color-border)'}`,
                color: i === activeBranch ? '#60a5fa' : 'var(--color-text-muted)',
                transition: 'all 0.3s ease',
              }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ───────────────────────────────────────────────────── */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>
          {stats.map(({ value, label, suffix }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-mono)', background: 'linear-gradient(135deg, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                <AnimatedCounter target={value} suffix={suffix} />
              </div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
              Features
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, margin: 0 }}>
              Everything your result system needs
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: 500, margin: '1rem auto 0', lineHeight: 1.7 }}>
              Built specifically for engineering colleges with ISE/ESE exam patterns, internship grades, and SGPA/CGPA tracking.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {features.map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="card" style={{ padding: '1.75rem' }}>
                <div style={{
                  width: 48, height: 48, background: bg,
                  borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700 }}>{title}</h3>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GAZETTE READER HIGHLIGHT ────────────────────────────────── */}
      <section style={{ padding: '4rem 2rem', background: 'var(--color-bg-surface)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
              ✦ AI Gazette Reader
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
              Upload PDF.<br />Get your marks <span style={{ color: '#10b981' }}>instantly.</span>
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Our Java-powered intelligent parser reads your official result gazette, extracts subject-wise marks, ISE/ESE breakdown, and automatically calculates your SGPA — in seconds.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Supports all standard gazette formats',
                'ISE-1, ISE-2, ISE-3/IE and ESE extraction',
                'SGPA & CGPA auto-calculation',
                'Confidence score for each extracted field',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }} onClick={() => navigate('/login')}>
              Try Gazette Reader <ArrowRight size={14} />
            </button>
          </div>

          {/* Mock UI Preview */}
          <div className="card" style={{ padding: '1.5rem', background: 'var(--color-bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ marginLeft: 8, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>gazette_SEM5.pdf</span>
            </div>
            <div style={{
              background: 'rgba(16,185,129,0.05)',
              border: '2px dashed rgba(16,185,129,0.2)',
              borderRadius: 12, padding: '2rem',
              textAlign: 'center', marginBottom: '1rem',
            }}>
              <Upload size={28} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: 600 }}>Gazette extracted successfully</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', marginTop: 4 }}>Confidence: 98.4%</div>
            </div>
            {/* Mock result rows */}
            {[
              { sub: 'Engineering Mathematics', ise: 42, ese: 71, total: 113, max: 150, grade: 'A' },
              { sub: 'Data Structures',         ise: 46, ese: 83, total: 129, max: 150, grade: 'O' },
              { sub: 'Digital Electronics',     ise: 38, ese: 64, total: 102, max: 150, grade: 'B+'},
            ].map(row => (
              <div key={row.sub} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.6rem 0',
                borderBottom: '1px solid var(--color-border)',
                fontSize: '0.75rem',
              }}>
                <span style={{ color: 'var(--color-text-secondary)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.sub}</span>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{row.total}/{row.max}</span>
                  <span className={`grade-chip grade-${row.grade === 'O' ? 'O' : row.grade.startsWith('A') ? 'A' : 'B'}`}>{row.grade}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>SGPA</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#34d399' }}>8.76</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ROLES ───────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '1rem' }}>
            One system, three portals
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '3rem' }}>
            Custom dashboards for every role in your college.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {[
              { role: 'Student', icon: GraduationCap, color: '#3b82f6', perks: ['View ISE & ESE marks', 'SGPA/CGPA tracking', 'Upload gazette PDFs', 'Semester-wise history'] },
              { role: 'Faculty', icon: Users,          color: '#10b981', perks: ['Enter marks per subject', 'View assigned subjects', 'Bulk mark uploads', 'Student performance view'] },
              { role: 'HoD',    icon: Award,           color: '#f59e0b', perks: ['Branch-wide results', 'Pass/Fail analytics', 'Performance reports', 'Cross-semester trends'] },
            ].map(({ role, icon: Icon, color, perks }) => (
              <div key={role} className="card" style={{ padding: '2rem', textAlign: 'left' }}>
                <div style={{ width: 48, height: 48, background: `${color}15`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ margin: '0 0 1rem', fontWeight: 700 }}>{role}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {perks.map(p => (
                    <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      <Star size={10} color={color} fill={color} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FOOTER ──────────────────────────────────────────────── */}
      <section style={{
        padding: '5rem 2rem',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.05))',
        borderTop: '1px solid var(--color-border)',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
          Ready to get started?
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem' }}>
          Sign in with your college credentials to access your personalized result portal.
        </p>
        <button
          className="btn-primary"
          style={{ fontSize: '1rem', padding: '0.875rem 2.5rem', borderRadius: 12 }}
          onClick={() => navigate('/login')}
        >
          Access RMS·AG Portal <ArrowRight size={16} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--color-border)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
        © {new Date().getFullYear()} RMS·AG — College Result Management System. Built with ☕ Java & ⚛️ React.
      </footer>
    </div>
  )
}
