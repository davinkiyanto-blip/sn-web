import { create } from 'zustand'
import { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

interface AuthState {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize auth state listener
  if (typeof window !== 'undefined') {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false })
    })
  }

  return {
    user: null,
    loading: true,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
  }
})
