'use client'

import { Search, Menu } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'
import { Avatar } from '@/components/ui/Avatar'
import Link from 'next/link'

export function Topbar() {
  const { user, toggleMobileSidebar } = useAppStore()

  return (
    <header className="h-16 bg-neutral-100/80 backdrop-blur-md border-b border-neutral-100 flex items-center justify-between px-4 md:px-8 shrink-0 z-10 relative">
      {/* Left side: Hamburger button & Search */}
      <div className="flex items-center gap-3 flex-1 md:flex-initial">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 rounded-2xl bg-white border border-neutral-200 hover:bg-neutral-50 transition-all shadow-sm cursor-pointer shrink-0"
          title="Open Menu"
        >
          <Menu className="w-5 h-5 text-neutral-600" />
        </button>

        {/* Search */}
        <div className="relative w-full max-w-xs md:max-w-md group hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
          <input
            type="text"
            placeholder="Search for magic... ✨"
            className="w-full pl-11 pr-4 py-2 rounded-full bg-white border-2 border-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-200 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        <button className="relative p-2.5 rounded-full bg-white border border-neutral-200 hover:bg-neutral-50 transition-all shadow-sm cursor-pointer group">
          <span className="text-md md:text-lg leading-none group-hover:animate-bounce-soft inline-block">🔔</span>
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-neutral-900 border-2 border-white rounded-full" />
        </button>
        <div className="w-px h-8 bg-neutral-100" />
        <Link 
          href="/settings"
          className="flex items-center gap-2 bg-white p-1 pr-1.5 sm:pr-3 rounded-full border border-neutral-100 shadow-sm cursor-pointer hover:border-neutral-200 hover:bg-neutral-50 transition-all select-none"
        >
          <Avatar name={user?.displayName || 'User'} size="sm" />
          <span className="text-xs sm:text-sm font-medium text-neutral-800 hidden sm:inline">Hi, {user?.displayName?.split(' ')[0] || 'User'} 👋</span>
        </Link>
      </div>
    </header>
  )
}
