# Supabase Setup Guide for RMS·AG
## Complete step-by-step — takes ~10 minutes

---

## Step 1 — Create Your Supabase Project

1. Go to **[https://supabase.com](https://supabase.com)** → Click **"Start your project"**
2. Sign in with **GitHub** or **Google**
3. Click **"New Project"**
4. Fill in:
   - **Organization**: Your college name
   - **Project name**: `rms-ag`
   - **Database Password**: Set a strong password (save it!)
   - **Region**: Choose closest to India → `ap-south-1 (Mumbai)` ✅
5. Click **"Create new project"** — wait ~2 minutes for it to spin up

---

## Step 2 — Run the Database Schema

1. In your Supabase project, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file: `backend/src/main/resources/db/schema.sql`
4. Copy the **entire contents** and paste into the SQL Editor
5. Click **"Run"** (Ctrl+Enter)
6. You should see: ✅ **"Success. No rows returned"** for each statement

> This creates all 13 tables, indexes, RLS policies, and seeds the branches, academic years, semesters, and exam types automatically.

---

## Step 3 — Configure Authentication

### Enable Email Auth
1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled ✅
3. Set **"Confirm email"** → **OFF** for testing (turn ON for production)

### Enable GitHub OAuth (Optional but recommended)
1. Go to **Authentication** → **Providers** → **GitHub**
2. Enable it → you'll need a GitHub OAuth App:
   - Go to GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
   - **Homepage URL**: `http://localhost:5173`
   - **Callback URL**: copy from Supabase → paste here
3. Copy Client ID + Secret back to Supabase

### Enable Google OAuth (Optional)
1. Go to **Authentication** → **Providers** → **Google**
2. Follow the same flow with Google Cloud Console OAuth credentials

---

## Step 4 — Get Your API Keys

Go to **Settings** → **API** and copy these 3 values:

| Key | Where to use |
|-----|-------------|
| **Project URL** | `frontend/.env.local` → `VITE_SUPABASE_URL` |
| **anon public** key | `frontend/.env.local` → `VITE_SUPABASE_ANON_KEY` |
| **JWT Secret** | `backend/application.properties` → `supabase.jwt.secret` |

Go to **Settings** → **Database** → **Connection string** → **URI** and copy:

| Key | Where to use |
|-----|-------------|
| **Connection string (URI)** | Extract host, port, password for `application.properties` |

---

## Step 5 — Create Your .env.local File

In the `frontend/` folder, create a new file called `.env.local`:

```env
VITE_SUPABASE_URL=https://abcdefghijklmno.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_BASE_URL=http://localhost:8080
```

> ⚠️ **Never commit `.env.local` to Git!** It's already in `.gitignore`.

---

## Step 6 — Update Backend application.properties

Open `backend/src/main/resources/application.properties` and fill in:

```properties
spring.datasource.url=jdbc:postgresql://db.YOUR_PROJECT_REF.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=YOUR_DB_PASSWORD_FROM_STEP_1

supabase.jwt.secret=YOUR_JWT_SECRET_FROM_SETTINGS_API
supabase.project.url=https://YOUR_PROJECT_REF.supabase.co
```

---

## Step 7 — Create Your First Users in Supabase

Go to **Authentication** → **Users** → **"Invite user"** or use **"Add user"**:

| Name | Email | Password | Role (set in user_metadata) |
|------|-------|----------|------------------------------|
| Test Student | student@test.com | Test@1234 | STUDENT |
| Test Faculty | faculty@test.com | Test@1234 | FACULTY |
| HoD Name | hod@test.com | Test@1234 | HOD |

### Set Role via SQL (important!)
After creating users, run this in SQL Editor:

```sql
-- Set role for a student (replace the email)
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "STUDENT"}'::jsonb
WHERE email = 'student@test.com';

-- Set role for faculty
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "FACULTY"}'::jsonb
WHERE email = 'faculty@test.com';

-- Set role for HoD
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "HOD"}'::jsonb
WHERE email = 'hod@test.com';
```

---

## Step 8 — Start Everything

### Frontend (already running)
```bash
# Should already be running at http://localhost:5173
# If not:
cd frontend
npm run dev
```

### Backend
```bash
cd backend
mvn spring-boot:run
# → http://localhost:8080
# → Swagger: http://localhost:8080/swagger-ui.html
```

---

## Step 9 — Test the Full Flow

1. Open `http://localhost:5173`
2. Click **"Access Portal"** → goes to Login
3. Enter your student email + password → **Sign In**
4. Should redirect to **Student Dashboard** ✅
5. Try the **Gazette Reader** — upload any PDF to test the pipeline

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Invalid login credentials" | Check email/password in Supabase → Authentication → Users |
| "JWT invalid" | Make sure `supabase.jwt.secret` in backend matches Supabase Settings → API → JWT Secret |
| Backend 401 errors | Ensure Spring Boot is running and `VITE_API_BASE_URL` points to `http://localhost:8080` |
| CORS error | Add `http://localhost:5173` to `cors.allowed-origins` in `application.properties` |
| Schema already exists | Run `DROP TABLE IF EXISTS ... CASCADE;` before schema.sql or use a fresh project |
