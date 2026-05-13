import { create } from 'zustand'
import type { User } from '@/types/user'

interface AppState {
  user: User | null
  sidebarCollapsed: boolean
  setUser: (user: User | null) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  sidebarCollapsed: false,
  setUser: (user) => set({ user }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}))
