-- ═══════════════════════════════════════════════════════════════════
-- RMS·AG Database Schema — Supabase PostgreSQL
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── 1. Branches ──────────────────────────────────────────────────
CREATE TABLE branches (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    code        VARCHAR(10)  NOT NULL UNIQUE,  -- IT, COMP, EXTC, etc.
    created_at  TIMESTAMPTZ  DEFAULT NOW()
);

INSERT INTO branches (name, code) VALUES
    ('Information Technology',            'IT'),
    ('Computer Engineering',              'COMP'),
    ('Electronics & Telecomm.',           'EXTC'),
    ('Electronics & Computer Science',    'ECS'),
    ('Mechanical Engineering',            'MECH'),
    ('Metallurgy & Materials Eng.',       'MME'),
    ('AI & Data Science',                 'AIDS'),
    ('AI & Machine Learning',             'AIML'),
    ('Internet of Things',                'IoT'),
    ('Computer Science & Engineering',    'CSE'),
    ('Civil Engineering',                 'CIVIL');

-- ─── 2. Academic Years ────────────────────────────────────────────
CREATE TABLE academic_years (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name         VARCHAR(10) NOT NULL UNIQUE,  -- FE, SE, TE, BE
    year_number  INT         NOT NULL          -- 1, 2, 3, 4
);

INSERT INTO academic_years (name, year_number) VALUES
    ('FE', 1), ('SE', 2), ('TE', 3), ('BE', 4);

-- ─── 3. Semesters ─────────────────────────────────────────────────
CREATE TABLE semesters (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_number  INT         NOT NULL,   -- 1–8
    academic_year_id UUID        NOT NULL REFERENCES academic_years(id),
    semester_type    VARCHAR(10) NOT NULL    -- ODD | EVEN
);

INSERT INTO semesters (semester_number, academic_year_id, semester_type) VALUES
    (1, (SELECT id FROM academic_years WHERE name = 'FE'), 'ODD'),
    (2, (SELECT id FROM academic_years WHERE name = 'FE'), 'EVEN'),
    (3, (SELECT id FROM academic_years WHERE name = 'SE'), 'ODD'),
    (4, (SELECT id FROM academic_years WHERE name = 'SE'), 'EVEN'),
    (5, (SELECT id FROM academic_years WHERE name = 'TE'), 'ODD'),
    (6, (SELECT id FROM academic_years WHERE name = 'TE'), 'EVEN'),
    (7, (SELECT id FROM academic_years WHERE name = 'BE'), 'ODD'),
    (8, (SELECT id FROM academic_years WHERE name = 'BE'), 'EVEN');

-- ─── 4. Exam Types ────────────────────────────────────────────────
CREATE TABLE exam_types (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name      VARCHAR(30) NOT NULL UNIQUE,
    max_marks INT                             -- null = grade only
);

INSERT INTO exam_types (name, max_marks) VALUES
    ('ISE-1', 25),
    ('ISE-2', 25),
    ('ISE-3/IE', 25),
    ('ESE', 100);

-- ─── 5. Subjects ──────────────────────────────────────────────────
CREATE TABLE subjects (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code           VARCHAR(20)  NOT NULL,
    name           VARCHAR(150) NOT NULL,
    branch_id      UUID         NOT NULL REFERENCES branches(id),
    semester_id    UUID         NOT NULL REFERENCES semesters(id),
    total_marks    INT          NOT NULL,           -- 150 or 125
    subject_type   VARCHAR(30)  DEFAULT 'THEORY',  -- THEORY | LAB | INTERNSHIP | INDUSTRY_PRACTICE
    credits        INT          NOT NULL DEFAULT 4,
    created_at     TIMESTAMPTZ  DEFAULT NOW(),
    UNIQUE (code, branch_id, semester_id)
);

-- ─── 6. User Profiles (Role extension on Supabase auth.users) ─────
CREATE TABLE user_profiles (
    id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role       VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT', 'FACULTY', 'HOD')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 7. Students ──────────────────────────────────────────────────
CREATE TABLE students (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID         REFERENCES auth.users(id) ON DELETE SET NULL,
    enrollment_no       VARCHAR(20)  NOT NULL UNIQUE,
    name                VARCHAR(100) NOT NULL,
    branch_id           UUID         NOT NULL REFERENCES branches(id),
    academic_year_id    UUID         NOT NULL REFERENCES academic_years(id),
    current_semester_id UUID         NOT NULL REFERENCES semesters(id),
    roll_no             VARCHAR(10),
    phone               VARCHAR(15),
    created_at          TIMESTAMPTZ  DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  DEFAULT NOW()
);

-- ─── 8. Faculty ───────────────────────────────────────────────────
CREATE TABLE faculty (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID         REFERENCES auth.users(id) ON DELETE SET NULL,
    name          VARCHAR(100) NOT NULL,
    employee_id   VARCHAR(20)  UNIQUE,
    branch_id     UUID         NOT NULL REFERENCES branches(id),
    designation   VARCHAR(80),
    is_hod        BOOLEAN      DEFAULT FALSE,
    created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- ─── 9. Faculty-Subject Assignments ───────────────────────────────
CREATE TABLE faculty_subjects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id      UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    subject_id      UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    academic_year   VARCHAR(10) NOT NULL,  -- e.g., '2024-25'
    UNIQUE (faculty_id, subject_id, academic_year)
);

-- ─── 10. Results ──────────────────────────────────────────────────
CREATE TABLE results (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID           NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id      UUID           NOT NULL REFERENCES subjects(id),
    exam_type_id    UUID           NOT NULL REFERENCES exam_types(id),
    marks_obtained  DECIMAL(5, 2),
    max_marks       INT            NOT NULL,
    is_absent       BOOLEAN        DEFAULT FALSE,
    entered_by      UUID           REFERENCES faculty(id),
    created_at      TIMESTAMPTZ    DEFAULT NOW(),
    updated_at      TIMESTAMPTZ    DEFAULT NOW(),
    UNIQUE (student_id, subject_id, exam_type_id)
);

-- ─── 11. Special Results (Internship / Industry Practice) ─────────
CREATE TABLE special_results (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id       UUID        NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id       UUID        NOT NULL REFERENCES subjects(id),
    grade            VARCHAR(5)  NOT NULL,  -- O, A+, A, B+, B, C, F
    description      TEXT,
    academic_year    VARCHAR(10),
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (student_id, subject_id)
);

-- ─── 12. GPA Records ──────────────────────────────────────────────
CREATE TABLE gpa_records (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id           UUID           NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    semester_id          UUID           NOT NULL REFERENCES semesters(id),
    sgpa                 DECIMAL(4, 2),
    cgpa                 DECIMAL(4, 2),
    is_auto_calculated   BOOLEAN        DEFAULT TRUE,
    total_credits        INT,
    credits_earned       INT,
    created_at           TIMESTAMPTZ    DEFAULT NOW(),
    updated_at           TIMESTAMPTZ    DEFAULT NOW(),
    UNIQUE (student_id, semester_id)
);

-- ─── 13. Gazette Jobs ─────────────────────────────────────────────
CREATE TABLE gazette_jobs (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id       UUID           NOT NULL REFERENCES students(id),
    file_name        VARCHAR(255),
    file_url         TEXT,
    status           VARCHAR(20)    DEFAULT 'PENDING', -- PENDING | PROCESSING | COMPLETED | FAILED
    extracted_data   JSONB,
    confidence_score DECIMAL(5, 2),
    error_message    TEXT,
    created_at       TIMESTAMPTZ    DEFAULT NOW(),
    completed_at     TIMESTAMPTZ
);

-- ─── Indexes ──────────────────────────────────────────────────────
CREATE INDEX idx_results_student     ON results(student_id);
CREATE INDEX idx_results_subject     ON results(subject_id);
CREATE INDEX idx_students_branch     ON students(branch_id);
CREATE INDEX idx_students_user       ON students(user_id);
CREATE INDEX idx_gazette_jobs_student ON gazette_jobs(student_id);
CREATE INDEX idx_gazette_jobs_status  ON gazette_jobs(status);

-- ─── Updated_at Trigger Function ──────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_students_updated   BEFORE UPDATE ON students   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_results_updated    BEFORE UPDATE ON results    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_gpa_updated        BEFORE UPDATE ON gpa_records FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────
ALTER TABLE students         ENABLE ROW LEVEL SECURITY;
ALTER TABLE results          ENABLE ROW LEVEL SECURITY;
ALTER TABLE gpa_records      ENABLE ROW LEVEL SECURITY;
ALTER TABLE gazette_jobs     ENABLE ROW LEVEL SECURITY;

-- Students can only see their own data
CREATE POLICY "Students see own data" ON students
    FOR SELECT USING (user_id = auth.uid());

-- Students can only see their own results
CREATE POLICY "Students see own results" ON results
    FOR SELECT USING (
        student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
    );

-- Students can only see their own GPA
CREATE POLICY "Students see own GPA" ON gpa_records
    FOR SELECT USING (
        student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
    );

-- Students can only see their own gazette jobs
CREATE POLICY "Students see own gazette jobs" ON gazette_jobs
    FOR SELECT USING (
        student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
    );
