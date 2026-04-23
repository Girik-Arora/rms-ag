import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/services/supabase'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:            null,
      token:           null,
      role:            null,
      isAuthenticated: false,
      profile:         null,

      setAuth: ({ user, token, role, profile }) =>
        set({ user, token, role, profile, isAuthenticated: true }),

      updateProfile: (profile) => set({ profile }),

      // Clears state ONLY — does NOT call supabase.auth.signOut()
      // Used by onAuthStateChange to avoid recursive signOut loop
      clearAuth: () =>
        set({ user: null, token: null, role: null, isAuthenticated: false, profile: null }),

      // Full logout: calls signOut then clears state
      logout: async () => {
        try {
          await supabase.auth.signOut()
        } catch (e) {
          // Ignore signOut errors — still clear local state
        }
        set({ user: null, token: null, role: null, isAuthenticated: false, profile: null })
      },

      getToken: () => get().token,

      // ── Restore session from Supabase on app load ────────────────
      restoreSession: async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const user = session.user
          const role = user.user_metadata?.role || user.app_metadata?.role || 'STUDENT'
          set({
            user:            { id: user.id, email: user.email },
            token:           session.access_token,
            role,
            isAuthenticated: true,
            profile: get().profile || { name: user.user_metadata?.name || user.email },
          })
        } else {
          set({ user: null, token: null, role: null, isAuthenticated: false, profile: null })
        }
      },
    }),
    {
      name: 'rms-ag-auth',
      partialize: (state) => ({
        user:            state.user,
        token:           state.token,
        role:            state.role,
        profile:         state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
