'use client'

import { cn } from '@/lib/utils/cn'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppStore } from '@/lib/store/useAppStore'
import { signOut } from '@/lib/firebase/auth'
import { Avatar } from '@/components/ui/Avatar'
import { ChevronLeft, LogOut, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  { label: 'Dashboard',      href: '/dashboard',       emoji: '🏠' },
  { label: 'Notes Hub',      href: '/notes-hub',       emoji: '📚' },
  { label: 'Study Planner',  href: '/study-planner',   emoji: '📅' },
  { label: 'Leaderboard',    href: '/leaderboard',     emoji: '🏆' },
  { label: 'Community',      href: '/community',       emoji: '💬' },
  { label: 'Flashcards',     href: '/flashcards',      emoji: '🗂️' },
  { label: 'Quiz',           href: '/quiz',            emoji: '🎯' },
  { label: 'AI Assistant',   href: '/ai-assistant',    emoji: '✨' },
  { label: 'Settings',       href: '/settings',        emoji: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen, setUser } = useAppStore()

  const handleSignOut = async () => {
    await signOut()
    localStorage.removeItem('helphive_demo_user')
    setUser(null)
    setMobileSidebarOpen(false)
    router.push('/login')
  }

  const SidebarContent = ({ isMobile = false }) => {
    const collapsed = isMobile ? false : sidebarCollapsed

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Logo & Close Button (for mobile) */}
        <div className={cn(
          'flex items-center justify-between px-5 py-6 border-b border-neutral-100',
          collapsed && 'justify-center px-2'
        )}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-xl">🐝</span>
            </div>
            {!collapsed && (
              <span className="font-serif text-xl text-neutral-900 tracking-tight italic">HelpHive</span>
            )}
          </div>
          {isMobile && (
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1.5 rounded-xl hover:bg-neutral-200 transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setMobileSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl text-neutral-500 font-medium hover:text-neutral-900 hover:bg-neutral-50 transition-all duration-200 select-none group',
                  active && 'bg-white border border-neutral-200 text-neutral-900 shadow-sm',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                <span className={cn('text-lg group-hover:scale-110 transition-transform duration-200', active && 'scale-110')}>
                  {item.emoji}
                </span>
                {!collapsed && (
                  <span className="text-sm tracking-wide">{item.label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={cn(
          'border-t border-neutral-100 p-4 bg-neutral-50/50',
          collapsed && 'flex flex-col items-center'
        )}>
          {!collapsed && user && (
            <div className="flex items-center gap-3 mb-4 px-2">
              <Avatar name={user.displayName || 'User'} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">{user.displayName}</p>
                <p className="text-xs text-neutral-400 capitalize font-medium">{user.role}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 w-full">
            {isMobile ? (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-red-50 border border-red-100 hover:border-red-200 text-red-500 transition-all shadow-sm cursor-pointer text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <>
                <button
                  onClick={toggleSidebar}
                  className="p-2.5 rounded-2xl bg-neutral-100 border border-neutral-100 hover:border-primary hover:text-primary transition-all shadow-sm cursor-pointer flex-1 flex items-center justify-center group"
                  title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  <ChevronLeft className={cn('w-4 h-4 text-neutral-400 group-hover:text-primary transition-all', collapsed && 'rotate-180')} />
                </button>
                {!collapsed && (
                  <button
                    onClick={handleSignOut}
                    className="p-2.5 rounded-2xl bg-neutral-100 border border-neutral-100 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all shadow-sm cursor-pointer text-neutral-400"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col h-screen bg-neutral-100 border-r border-neutral-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0',
          sidebarCollapsed ? 'w-20' : 'w-[240px]'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm cursor-pointer"
              onClick={() => setMobileSidebarOpen(false)}
            />
            {/* Drawer Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative flex flex-col w-[270px] h-full bg-neutral-100 shadow-2xl z-10"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
