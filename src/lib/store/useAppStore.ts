import { create } from 'zustand'
import type { User } from '@/types/user'

interface AppState {
  user: User | null
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  setUser: (user: User | null) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleMobileSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  setUser: (user) => set({ user }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleMobileSidebar: () => set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
}))
