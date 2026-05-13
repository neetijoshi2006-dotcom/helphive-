'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/firebase/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Hexagon } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-4">
            <Hexagon className="w-6 h-6 text-neutral-900" strokeWidth={2.5} />
          </div>
          <h1 className="font-serif text-3xl text-neutral-900">HelpHive</h1>
          <p className="text-sm text-neutral-400 mt-1">Intelligent support operations</p>
        </div>

        {/* Form */}
        <div className="bg-neutral-100 rounded-2xl border border-neutral-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900 mb-1">Welcome back</h2>
          <p className="text-sm text-neutral-400 mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" loading={loading} className="w-full">
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-neutral-400 mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
