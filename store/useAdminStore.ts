import { create } from 'zustand'

interface AdminState {
  isAdmin: boolean
  adminUser: any | null
  setIsAdmin: (admin: boolean) => void
  setAdminUser: (user: any) => void
}

export const useAdminStore = create<AdminState>((set) => ({
  isAdmin: false,
  adminUser: null,
  setIsAdmin: (admin: boolean) => set({ isAdmin: admin }),
  setAdminUser: (user: any) => set({ adminUser: user }),
}))
