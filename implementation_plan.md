# RMS AG — College Result Management System
## Full-Stack Implementation Plan (Java-Oriented)

A professional, end-to-end Result Management System for your college with a stunning React frontend, robust Java Spring Boot backend, Supabase (PostgreSQL) database, and an intelligent ML-powered Gazette Reader — all built to production standards.

---

## Project Overview

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS + shadcn/ui |
| **Backend** | Java 21 + Spring Boot 3.x + Spring Security 6 |
| **Database** | Supabase (PostgreSQL 15) with Row Level Security |
| **Auth** | Supabase Auth → JWT validated by Spring Boot |
| **ML/AI Gazette** | Java (Apache PDFBox + Tess4J + Tabula-Java + Apache OpenNLP) |
| **Async Processing** | Spring Boot `@Async` + CompletableFuture (no extra queue needed initially) |
| **API** | RESTful JSON API (Spring MVC) |

---

## User Review Required

> [!IMPORTANT]
> **Regarding the ML Gazette Reader — Pure Java vs. Hybrid Approach**
>
> Your gazette PDFs likely contain **scanned table images** (not selectable text). OCR accuracy with Tesseract alone can vary (70–90%) depending on scan quality. Two options:
>
> **Option A (Pure Java — recommended):** Apache PDFBox + Tess4J + Tabula-Java + regex/OpenNLP rules. Entirely Java. Best for structured/semi-structured gazettes.
>
> **Option B (Java + Python microservice):** Spring Boot handles everything; a small Python Flask service (called via HTTP) runs a fine-tuned transformer model (LayoutLMv3) for higher accuracy on complex gazette tables.
>
> **I recommend Option A to stay fully Java-oriented.** Option B is only needed if gazette formats are highly irregular.

> [!WARNING]
> **Supabase Free Tier Limits**
> The free tier allows 500MB storage, 2GB bandwidth/month, and 50,000 MAUs. For a college with hundreds of students, this should be fine — but please confirm you're okay with Supabase's pricing model before we set up the DB schema.

---

## Open Questions

> [!IMPORTANT]
> Please answer these before I start coding:

1. **Roles**: Which user roles are needed?
   - `ADMIN` (full access — add students, subjects, publish results)
   - `TEACHER/FACULTY` (can enter/upload marks for their courses)
   - `STUDENT` (read-only — view own results)
   - `PRINCIPAL/HOD` (read-only with reports — view all department results)

2. **Academic Structure**: Is your college organized as:
   - Branch → Semester → Subject → Marks? Or a different hierarchy?

3. **Gazette Format**: Are your gazettes:
   - (a) Digital PDFs with selectable text, or
   - (b) Scanned/image-based PDFs?

4. **Result Display**: Should students see:
   - Individual subject marks + grades?
   - SGPA/CGPA calculations?
   - Pass/Fail status per subject?

5. **Deployment Target**: Where will this be hosted?
   - Local college server (JAR/WAR), or
   - Cloud (Railway, Render, Heroku for Java backend)?

---

## Proposed Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  REACT FRONTEND (Vite)                  │
│   Pages: Landing · Login · Student Dashboard ·          │
│   Faculty Portal · Admin Panel · Gazette Reader         │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS REST API (JWT Bearer)
┌────────────────────▼────────────────────────────────────┐
│           SPRING BOOT 3.x API SERVER (Java 21)          │
│   Controllers · Services · JPA Repositories             │
│   Spring Security → JWT Filter (validates Supabase JWT) │
│   Gazette Reader Engine: PDFBox + Tess4J + Tabula-Java  │
└────────────────────┬────────────────────────────────────┘
                     │ JDBC (PostgreSQL driver)
┌────────────────────▼────────────────────────────────────┐
│        SUPABASE (PostgreSQL 15 + Auth + Storage)        │
│   Tables: users · students · subjects · results ·       │
│           semesters · branches · gazette_jobs           │
│   Supabase Storage: gazette PDFs                        │
└─────────────────────────────────────────────────────────┘
```

---

## Proposed Changes

### Phase 1 — Project Scaffolding & Setup

#### [NEW] `rms-ag/` — Root monorepo
```
rms-ag/
├── frontend/           ← React + Vite + Tailwind
├── backend/            ← Spring Boot Java Maven project
└── README.md
```

---

### Phase 2 — Database Schema (Supabase)

#### [NEW] `backend/src/main/resources/db/schema.sql`

Key tables:
- **`branches`** — (CSE, ECE, MECH, etc.)
- **`semesters`** — (1–8, linked to branch)
- **`subjects`** — (code, name, credits, semester)
- **`students`** — (enrollment_no, name, branch, current_semester, user_id FK → Supabase auth.users)
- **`faculty`** — (faculty_id, name, department, user_id FK)
- **`results`** — (student_id, subject_id, semester, internal_marks, external_marks, total, grade, pass_fail)
- **`gazette_jobs`** — (id, student_id, file_url, status, extracted_data_json, created_at)

---

### Phase 3 — Spring Boot Backend

#### [NEW] `backend/pom.xml`
Maven dependencies:
- `spring-boot-starter-web`
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-security`
- `jjwt-api` (JWT validation)
- `postgresql` (JDBC driver)
- `pdfbox` (PDF parsing)
- `tess4j` (OCR wrapper for Tesseract)
- `tabula-java` (table extraction from PDFs)
- `opennlp-tools` (NLP for gazette parsing)
- `lombok` (boilerplate reduction)
- `mapstruct` (DTO mapping)
- `springdoc-openapi-starter-webmvc-ui` (Swagger UI)

#### [NEW] Backend Package Structure
```
com.rmsag/
├── config/
│   ├── SecurityConfig.java         ← Spring Security 6 filter chain
│   └── JwtAuthFilter.java          ← Validates Supabase JWT
├── controller/
│   ├── AuthController.java         ← /api/auth/* (profile sync)
│   ├── StudentController.java      ← /api/students/*
│   ├── ResultController.java       ← /api/results/*
│   ├── SubjectController.java      ← /api/subjects/*
│   ├── FacultyController.java      ← /api/faculty/*
│   └── GazetteController.java      ← /api/gazette/* (PDF upload + status)
├── service/
│   ├── StudentService.java
│   ├── ResultService.java
│   ├── GazetteService.java         ← Orchestrates ML pipeline
│   └── gazette/
│       ├── PdfExtractorService.java    ← PDFBox text + image extraction
│       ├── OcrService.java             ← Tess4J OCR
│       ├── TableParserService.java     ← Tabula-Java table extraction
│       └── MarksParserService.java     ← Regex + OpenNLP marks identification
├── model/
│   ├── Student.java, Subject.java, Result.java, etc.
│   └── GazetteJob.java
├── repository/ (JPA Repositories)
├── dto/ (Request/Response DTOs)
└── RmsAgApplication.java
```

#### Key API Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/sync` | All | Sync Supabase user to local profile |
| GET | `/api/students/me` | STUDENT | Get own profile + results |
| GET | `/api/students/{id}/results` | ADMIN/FACULTY | Get student results |
| POST | `/api/results` | FACULTY/ADMIN | Add/update result |
| GET | `/api/results/semester/{sem}` | All | Get semester results |
| POST | `/api/gazette/upload` | STUDENT/ADMIN | Upload gazette PDF |
| GET | `/api/gazette/jobs/{jobId}` | STUDENT | Poll gazette job status |
| GET | `/api/gazette/jobs/{jobId}/result` | STUDENT | Get extracted marks |
| GET | `/api/reports/branch/{branchId}` | ADMIN/HOD | Branch performance report |
| GET | `/api/subjects` | All | List all subjects |

---

### Phase 4 — ML Gazette Reader Pipeline (Pure Java)

This is the most exciting feature. Here is the exact pipeline:

```
PDF Upload (Multipart)
        │
        ▼
GazetteController → GazetteService (saves job, triggers async task)
        │
        ▼ (@Async thread)
PdfExtractorService
  ├── Try PDFTextStripper (selectable text) → If success → TableParserService
  └── If scanned → PDFRenderer (300 DPI image) → OcrService (Tess4J)
                                                         │
                                                         ▼
                                                  TableParserService
                                                  (Tabula-Java grid detection)
                                                         │
                                                         ▼
                                                  MarksParserService
                                                  (Regex patterns + OpenNLP NER
                                                   to find: enrollment no, name,
                                                   subject codes, marks, grades)
                                                         │
                                                         ▼
                                                  Store structured JSON
                                                  in gazette_jobs.extracted_data
                                                         │
                                                         ▼
                                                  Frontend polls → displays results
```

**What the ML extracts and shows:**
- Student name + enrollment number (verified against DB)
- Subject-wise: Internal marks, External marks, Total, Grade
- Overall SGPA/CGPA calculation
- Pass/Fail highlights per subject
- Confidence score for each extracted field
- Visual PDF preview with extracted fields highlighted

---

### Phase 5 — React Frontend

#### Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero, features, college branding |
| `/login` | Login | Supabase Auth UI |
| `/student/dashboard` | Student Home | KPI cards, recent results, CGPA trend |
| `/student/results` | Results | All semester results in a table |
| `/student/gazette` | Gazette Reader | Upload PDF, view extracted marks |
| `/faculty/dashboard` | Faculty Home | Assigned subjects, pending entries |
| `/faculty/marks` | Mark Entry | Enter/update marks per subject |
| `/admin/dashboard` | Admin Home | System-wide stats |
| `/admin/students` | Student Management | CRUD students |
| `/admin/results` | Result Management | Bulk upload/edit |
| `/admin/reports` | Reports | Branch/semester performance charts |

#### UI Design System
- **Color Palette**: Deep navy `#0A0F1E` base, electric blue `#3B82F6` primary, emerald `#10B981` accent, gold `#F59E0B` for highlights
- **Typography**: `Inter` for UI, `JetBrains Mono` for data/marks
- **Components**: shadcn/ui base + custom glassmorphism cards
- **Charts**: Recharts (bar, line, radar for performance analysis)
- **Animations**: Framer Motion (page transitions, card reveals, number counters)
- **Tables**: TanStack Table (sortable, filterable, paginated)

#### Frontend Package Structure
```
frontend/src/
├── assets/
├── components/
│   ├── layout/ (Sidebar, Navbar, Layout)
│   ├── ui/ (shadcn components)
│   ├── charts/ (ResultChart, CGPATrend, BranchComparison)
│   ├── gazette/ (UploadZone, ExtractionProgress, ExtractedResultCard)
│   └── shared/ (StatsCard, DataTable, GradeChip)
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── student/ (Dashboard, Results, GazetteReader)
│   ├── faculty/ (Dashboard, MarkEntry)
│   └── admin/ (Dashboard, Students, Results, Reports)
├── hooks/ (useAuth, useResults, useGazette)
├── services/ (api.js — Axios instance with JWT interceptor)
├── store/ (Zustand for global state)
└── utils/ (gradeCalculator, cgpaCalculator)
```

---

## Build Order (Execution Phases)

| Phase | What Gets Built | Est. Complexity |
|-------|----------------|----------------|
| **1** | Project scaffolding (both frontend & backend), Supabase DB schema | Low |
| **2** | Spring Boot backend: auth, models, JPA, security filter | Medium |
| **3** | Core APIs: students, subjects, results CRUD | Medium |
| **4** | Gazette Reader Java pipeline: PDFBox + Tess4J + parser | High |
| **5** | React frontend: design system, layout, landing page | Medium |
| **6** | Student portal: dashboard + results view | Medium |
| **7** | Faculty portal: mark entry forms | Medium |
| **8** | Admin panel: management + reports/charts | Medium |
| **9** | Gazette Reader UI: upload + real-time polling + extraction display | High |
| **10** | Integration testing, polish, responsive fixes | Medium |

---

## Verification Plan

### Automated Tests
- Spring Boot: `mvn test` — JUnit 5 + Mockito unit tests for service layer
- API tests: MockMvc integration tests for all controllers
- Frontend: Vite dev server + manual UI testing via browser subagent

### Manual Verification
- Login/auth flow for each role
- Mark entry → result display pipeline
- Gazette upload → extraction → result display end-to-end
- Responsive design on mobile/tablet/desktop
- Swagger UI at `http://localhost:8080/swagger-ui.html`
