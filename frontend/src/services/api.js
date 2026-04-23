import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/services/supabase'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request Interceptor: attach fresh JWT ────────────────────────────────
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`
      } else {
        const token = useAuthStore.getState().getToken()
        if (token) config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // If getSession fails, fall back to stored token silently
      const token = useAuthStore.getState().getToken()
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor: handle errors ──────────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Don't show errors if the backend simply isn't running
    const isNetworkError = !error.response
    if (isNetworkError) {
      console.warn('[API] Backend not reachable — running in frontend-only mode')
      return Promise.reject(error)
    }

    const status  = error.response?.status
    const message = error.response?.data?.message || error.message || 'Something went wrong'

    if (status === 401) {
      // Use clearAuth (NOT logout) to avoid re-triggering supabase.auth.signOut()
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
    } else if (status === 403) {
      toast.error('Access denied')
    } else if (status >= 500) {
      toast.error('Server error — please try again later')
    } else if (status !== 404) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  // Wrapped in try/catch so a missing backend doesn't crash the login flow
  syncProfile: async (data) => {
    try {
      return await api.post('/auth/sync', data)
    } catch {
      return null   // Backend offline — silently skip sync
    }
  },
  getMe: () => api.get('/auth/me'),
}

// ─── Students ─────────────────────────────────────────────────────────────
export const studentApi = {
  getMe: () => api.get('/students/me'),
  getById: (id) => api.get(`/students/${id}`),
  getAll: (params) => api.get('/students', { params }),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  getResults: (id) => api.get(`/students/${id}/results`),
}

// ─── Results ──────────────────────────────────────────────────────────────
export const resultApi = {
  getMyResults: () => api.get('/results/me'),
  getBySemester: (semId) => api.get(`/results/semester/${semId}`),
  getByStudent: (studentId, semId) =>
    api.get(`/results/student/${studentId}`, { params: { semesterId: semId } }),
  create: (data) => api.post('/results', data),
  update: (id, data) => api.put(`/results/${id}`, data),
  bulkCreate: (data) => api.post('/results/bulk', data),
  getGpa: (studentId) => api.get(`/results/gpa/${studentId}`),
}

// ─── Subjects ─────────────────────────────────────────────────────────────
export const subjectApi = {
  getAll: (params) => api.get('/subjects', { params }),
  getByBranchSemester: (branchId, semId) =>
    api.get('/subjects', { params: { branchId, semesterId: semId } }),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
}

// ─── Faculty ──────────────────────────────────────────────────────────────
export const facultyApi = {
  getMe: () => api.get('/faculty/me'),
  getAssignedSubjects: () => api.get('/faculty/me/subjects'),
  getStudentsBySubject: (subjectId, semId) =>
    api.get(`/faculty/subjects/${subjectId}/students`, { params: { semesterId: semId } }),
}

// ─── Gazette Reader ────────────────────────────────────────────────────────
export const gazetteApi = {
  upload: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/gazette/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        const pct = Math.round((e.loaded * 100) / e.total)
        onProgress?.(pct)
      },
    })
  },
  getJobStatus: (jobId) => api.get(`/gazette/jobs/${jobId}`),
  getJobResult: (jobId) => api.get(`/gazette/jobs/${jobId}/result`),
  getMyJobs: () => api.get('/gazette/jobs/my'),
}

// ─── Reports (HoD) ────────────────────────────────────────────────────────
export const reportApi = {
  getBranchStats: (branchId) => api.get(`/reports/branch/${branchId}`),
  getSemesterStats: (semId) => api.get(`/reports/semester/${semId}`),
  getPassFailStats: (params) => api.get('/reports/pass-fail', { params }),
  getTopPerformers: (branchId, limit = 10) =>
    api.get(`/reports/branch/${branchId}/top-performers`, { params: { limit } }),
}

export default api
