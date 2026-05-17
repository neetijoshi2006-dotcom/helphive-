'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, sendPasswordReset } from '@/lib/firebase/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowLeft, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [view, setView] = useState<'login' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Forgot password state
  const [resetEmail, setResetEmail] = useState('')
  const [sendingReset, setSendingReset] = useState(false)
  const [resetRequestedEmail, setResetRequestedEmail] = useState('')

  const router = useRouter()

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
      toast.success('Welcome back to HelpHive! 🐝')
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Sign in failed:', err)
      const message = err?.message || 'Invalid email or password 🥺'
      const cleanMessage = message.includes('auth/') 
        ? message.split('auth/')[1].replace(/-/g, ' ')
        : message
      toast.error(cleanMessage)
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!resetEmail.trim()) {
      toast.error('Please enter your email address! 🥺')
      return
    }
    setSendingReset(true)
    try {
      await sendPasswordReset(resetEmail.trim())
      toast.success('Password reset link sent! Please check your Inbox & Spam folder 📬', {
        duration: 8000,
      })
      setResetRequestedEmail(resetEmail.trim())
      setView('login')
      setEmail(resetEmail) // Autofill on back to login
    } catch (err: any) {
      console.error('Password reset failed:', err)
      const message = err?.message || 'Could not send reset link 🥺'
      const cleanMessage = message.includes('auth/') 
        ? message.split('auth/')[1].replace(/-/g, ' ')
        : message
      toast.error(cleanMessage)
    } finally {
      setSendingReset(false)
    }
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
        <div className="bg-white/80 backdrop-blur-md rounded-[32px] border border-neutral-100 p-8 shadow-xl overflow-hidden min-h-[380px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {view === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-neutral-900 mb-1">Welcome Back! ✨</h2>
                <p className="text-sm text-neutral-400 mb-6">Sign in to resume your learning adventures.</p>

                {resetRequestedEmail && (
                  <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/60 text-xs text-amber-800 leading-relaxed flex items-start gap-2">
                    <span className="text-sm shrink-0">⚠️</span>
                    <div>
                      <p className="font-bold">Check your Spam/Junk folder!</p>
                      <p className="mt-0.5 opacity-90">We sent a reset link to <strong className="underline">{resetRequestedEmail}</strong>. Since the email comes from the default Firebase address, it almost always lands in Spam first!</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-4">
                  <Input
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="you@school.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div>
                    <Input
                      id="password"
                      label="Password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setView('forgot')
                          setResetEmail(email)
                        }}
                        className="text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer select-none"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      loading={loading} 
                      className="w-full rounded-2xl bg-primary text-white hover:bg-primary-600 font-semibold py-3.5 cursor-pointer shadow-md hover:shadow-lg transition-all"
                    >
                      Sign In
                    </Button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors mb-4 cursor-pointer select-none"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Login</span>
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <Lock className="text-primary w-5 h-5" />
                  <h2 className="text-xl font-bold text-neutral-900">Forgot Password?</h2>
                </div>
                <p className="text-sm text-neutral-400 mb-6">
                  No worries! Enter your registered email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <Input
                    id="reset-email"
                    label="Email Address"
                    type="email"
                    placeholder="you@school.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      loading={sendingReset} 
                      className="w-full rounded-2xl bg-neutral-900 text-white hover:bg-neutral-800 font-semibold py-3.5 cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Mail size={16} />
                      <span>Send Reset Link 📧</span>
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-sm text-neutral-400 mt-6 font-medium">
          New to the hive?{' '}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Create an Account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
