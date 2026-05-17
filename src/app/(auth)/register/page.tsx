'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/firebase/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAppStore } from '@/lib/store/useAppStore'
import Link from 'next/link'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import type { User } from '@/types/user'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useAppStore()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters 🥺')
      return
    }
    setLoading(true)
    try {
      await signUp(email, password, name)
      toast.success('Account created successfully! Welcome 🐝')
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Registration failed:', err)
      const message = err?.message || 'Failed to create account 🥺'
      const cleanMessage = message.includes('auth/') 
        ? message.split('auth/')[1].replace(/-/g, ' ')
        : message
      toast.error(cleanMessage)
    } finally {
      setLoading(false)
    }
  }

  function handleDemoLogin() {
    setDemoLoading(true)
    setTimeout(() => {
      localStorage.setItem('helphive_demo_user', 'true')
      setUser({
        uid: 'demo-user-123',
        email: 'demo@helphive.com',
        displayName: 'Demo Bee 🐝',
        role: 'admin',
        workspaceId: 'default',
        createdAt: new Date(),
        lastSeen: new Date(),
      } as User)
      toast.success('Signed in as Guest Demo! 🍯✨')
      router.push('/dashboard')
      setDemoLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Aesthetic glowing background shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary-100 rounded-full blur-[120px] opacity-40 mix-blend-multiply filter pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary-200 rounded-full blur-[120px] opacity-40 mix-blend-multiply filter pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Intro */}
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-300 to-primary flex items-center justify-center mb-4 shadow-md"
          >
            <span className="text-3xl">🐝</span>
          </motion.div>
          <h1 className="font-serif text-4xl text-neutral-900 tracking-tight italic">HelpHive</h1>
          <p className="text-sm text-neutral-400 mt-1 font-medium">Your cozy educational sweet spot 🍯</p>
        </div>

        {/* Auth Box */}
        <div className="bg-white/80 backdrop-blur-md rounded-[32px] border border-neutral-100 p-8 shadow-xl">
          <h2 className="text-xl font-bold text-neutral-900 mb-1">Create Account! ✨</h2>
          <p className="text-sm text-neutral-400 mb-6">Join the hive to track goals and build study plans.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              label="Full Name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            
            <div className="pt-2">
              <Button 
                type="submit" 
                loading={loading} 
                disabled={demoLoading}
                className="w-full rounded-2xl bg-primary text-white hover:bg-primary-600 font-semibold py-3 cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-neutral-100 w-full" />
            <span className="absolute bg-white px-3 text-xs text-neutral-400 font-medium tracking-wider uppercase">Or</span>
          </div>

          {/* Guest/Demo Bypass Button */}
          <Button 
            onClick={handleDemoLogin} 
            loading={demoLoading}
            disabled={loading}
            variant="outline"
            className="w-full rounded-2xl border-2 border-primary bg-white text-primary hover:bg-primary-50 font-semibold py-3 cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Continue as Demo User 🍯</span>
          </Button>
        </div>

        <p className="text-center text-sm text-neutral-400 mt-6 font-medium">
          Already in the hive?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign In here
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
