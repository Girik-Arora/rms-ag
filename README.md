# RMS·AG — College Result Management System

> A professional, full-stack result management system for engineering colleges — built with React + Java Spring Boot + Supabase.

![RMS AG](https://img.shields.io/badge/Java-21-orange) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-green) ![React](https://img.shields.io/badge/React-18-blue) ![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-v4-cyan) ![Supabase](https://img.shields.io/badge/Database-Supabase-darkgreen)

## 📦 Project Structure

```
rms-ag/
├── frontend/           ← React 18 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── pages/      ← Landing, Login, Student, Faculty, HoD portals
│   │   ├── components/ ← Shared UI components
│   │   ├── services/   ← Axios API client
│   │   └── store/      ← Zustand auth store
│   └── package.json
│
├── backend/            ← Java 21 + Spring Boot 3
│   ├── src/main/java/com/rmsag/
│   │   ├── model/      ← JPA entities (13 tables)
│   │   ├── repository/ ← Spring Data JPA repos
│   │   ├── service/    ← Business logic + Gazette Reader
│   │   ├── controller/ ← REST API endpoints
│   │   ├── security/   ← JWT auth filter
│   │   └── config/     ← Security, CORS, Swagger
│   └── pom.xml
│
└── README.md
```

## 🎭 User Roles

| Role | Access |
|------|--------|
| **Student** | View own marks, SGPA/CGPA, upload gazette PDF |
| **Faculty** | Enter marks for assigned subjects (ISE-1, ISE-2, ISE-3/IE, ESE) |
| **HoD** | Branch-wide analytics, reports, all student results |

## 🏗 Academic Hierarchy

```
Branch (IT/COMP/EXTC/ECS/MECH/MME/AIDS/AIML/IoT/CSE/CIVIL)
  └── Academic Year (FE/SE/TE/BE)
        └── Semester (1–8, Odd/Even)
              └── Exam Type (ISE-1/ISE-2/ISE-3/IE/ESE)
                    └── Subject → Marks (out of 150 or 125)
                         + Summer Internship Grade
                         + Industry Practice Grade
```

## 🤖 Gazette Reader

The **star feature** — upload your college gazette PDF and get marks extracted automatically:

1. **Upload** — Drop your PDF in the Gazette Reader page
2. **Extract** — Java PDFBox extracts text from digital PDF
3. **Parse** — Regex + OpenNLP identifies marks, codes, grades
4. **Display** — SGPA/CGPA calculated, confidence score shown

## 🚀 Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

**Demo accounts (password: `demo1234`):**
- `student@rmsag.edu` → Student Portal
- `faculty@rmsag.edu` → Faculty Portal
- `hod@rmsag.edu` → HoD Portal

### Backend

**Prerequisites:** Java 21, Maven 3.9+

1. Create a [Supabase](https://supabase.com) project
2. Run `backend/src/main/resources/db/schema.sql` in Supabase SQL Editor
3. Set environment variables:
   ```
   SUPABASE_JWT_SECRET=your-supabase-jwt-secret
   SUPABASE_DB_PASSWORD=your-db-password
   SUPABASE_URL=https://xxxx.supabase.co
   ```
4. Update `application.properties` with your Supabase host
5. Run the backend:
   ```bash
   cd backend
   mvn spring-boot:run
   # → http://localhost:8080
   # → Swagger UI: http://localhost:8080/swagger-ui.html
   ```

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 · Vite · Tailwind CSS v4 · Framer Motion |
| UI Components | shadcn/ui (Radix) · Recharts · TanStack Query |
| Backend | Java 21 · Spring Boot 3.2 · Spring Security 6 |
| Auth | Supabase Auth → JWT (HS256) → Spring validates |
| Database | Supabase (PostgreSQL 15) + Row Level Security |
| PDF Processing | Apache PDFBox 3.0 · Tabula-Java |
| NLP | Apache OpenNLP (marks identification) |
| API Docs | SpringDoc OpenAPI 2 (Swagger UI) |

## 🌐 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel (`vercel deploy`) |
| Backend | Railway (`railway up`) |
| Database | Supabase Cloud |

## 📄 License

MIT — Built with ☕ Java & ⚛️ React for Indian Engineering Colleges.
