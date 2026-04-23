const gradeMap = {
  'O':  { label: 'O',  class: 'grade-O', full: 'Outstanding' },
  'A+': { label: 'A+', class: 'grade-O', full: 'Excellent'    },
  'A':  { label: 'A',  class: 'grade-A', full: 'Very Good'    },
  'B+': { label: 'B+', class: 'grade-A', full: 'Good'         },
  'B':  { label: 'B',  class: 'grade-B', full: 'Above Average'},
  'C':  { label: 'C',  class: 'grade-C', full: 'Average'      },
  'P':  { label: 'P',  class: 'grade-C', full: 'Pass'         },
  'F':  { label: 'F',  class: 'grade-F', full: 'Fail'         },
  'AB': { label: 'AB', class: 'grade-F', full: 'Absent'       },
}

export default function GradeChip({ grade, showFull = false }) {
  if (!grade) return <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>—</span>

  const g = gradeMap[grade?.toUpperCase()] || { label: grade, class: 'grade-C', full: grade }

  return (
    <span className={`grade-chip ${g.class}`} title={g.full}>
      {showFull ? g.full : g.label}
    </span>
  )
}

export function PassFailBadge({ pass }) {
  return pass
    ? <span className="pass-pill">PASS</span>
    : <span className="fail-pill">FAIL</span>
}
