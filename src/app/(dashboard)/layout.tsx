'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { useAuth } from '@/lib/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-neutral-400">Loading HelpHive...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 relative">
      {/* Decorative ambient blurred blobs */}
      <div className="hidden md:block absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-primary-100 rounded-full blur-[100px] opacity-30 pointer-events-none z-0" />
      <div className="hidden md:block absolute bottom-[10%] right-[5%] w-[450px] h-[450px] bg-primary-200 rounded-full blur-[120px] opacity-25 pointer-events-none z-0" />
      <div className="hidden md:block absolute top-[40%] right-[15%] w-[300px] h-[300px] bg-accent-soft rounded-full blur-[90px] opacity-35 pointer-events-none z-0" />

      {/* Floating Emojis & Shapes across the site */}
      <div className="hidden lg:block absolute top-[15%] left-[25%] text-4xl animate-float-slow opacity-15 select-none pointer-events-none z-0" title="Cozy Bee">🐝</div>
      <div className="hidden lg:block absolute bottom-[25%] left-[28%] text-3xl animate-float-slower opacity-15 select-none pointer-events-none z-0" title="Honey Pot">🍯</div>
      <div className="hidden lg:block absolute top-[25%] right-[8%] text-3xl animate-float-slower opacity-15 select-none pointer-events-none z-0" title="Sparkle">✨</div>
      <div className="hidden lg:block absolute bottom-[15%] right-[22%] text-4xl animate-float-slow opacity-15 select-none pointer-events-none z-0" title="Leaf">🌿</div>
      <div className="hidden lg:block absolute top-[50%] left-[18%] text-2xl animate-float-slower opacity-10 select-none pointer-events-none z-0" title="Daisy">🌼</div>
      <div className="hidden lg:block absolute top-[70%] right-[32%] text-2xl animate-float-slow opacity-10 select-none pointer-events-none z-0" title="Sweet star">⭐</div>

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
