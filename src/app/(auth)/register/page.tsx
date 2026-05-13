'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/firebase/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Hexagon } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await signUp(email, password, name)
      toast.success('Account created successfully!')
      router.push('/dashboard')
    } catch {
      toast.error('Failed to create account')
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
          <p className="text-sm text-neutral-400 mt-1">Create your account</p>
        </div>

        {/* Form */}
        <div className="bg-neutral-100 rounded-2xl border border-neutral-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900 mb-1">Get started</h2>
          <p className="text-sm text-neutral-400 mb-6">Set up your HelpHive workspace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              label="Full name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" loading={loading} className="w-full">
              Create account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-neutral-400 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
