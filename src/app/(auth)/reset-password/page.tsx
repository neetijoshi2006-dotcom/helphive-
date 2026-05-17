'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyResetCode, confirmReset } from '@/lib/firebase/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowLeft, Lock, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const oobCode = searchParams.get('oobCode')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Verify the action code on load
  useEffect(() => {
    async function checkCode() {
      if (!oobCode) {
        setError('No password reset code found. Please request a new link from the login page.')
        setVerifying(false)
        return
      }

      try {
        const userEmail = await verifyResetCode(oobCode)
        setEmail(userEmail || '')
      } catch (err: any) {
        console.error('Error verifying reset code:', err)
        let msg = 'The password reset link is invalid or has expired.'
        if (err?.code === 'auth/expired-action-code') {
          msg = 'This password reset link has expired. Please request a new one.'
        } else if (err?.code === 'auth/invalid-action-code') {
          msg = 'This password reset link has already been used or is invalid.'
        }
        setError(msg)
      } finally {
        setVerifying(false)
      }
    }
    checkCode()
  }, [oobCode])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (!oobCode) return

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long! 🥺')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match! 🥺')
      return
    }

    setLoading(true)
    try {
      await confirmReset(oobCode, password)
      toast.success('Password successfully reset! 🎉')
      setSuccess(true)
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      console.error('Password reset confirmation failed:', err)
      const message = err?.message || 'Could not reset password. Please try again 🥺'
      const cleanMessage = message.includes('auth/') 
        ? message.split('auth/')[1].replace(/-/g, ' ')
        : message
      toast.error(cleanMessage)
    } finally {
      setLoading(false)
    }
  }

  // Loading/Verifying state
  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-sm text-neutral-400 mt-4 font-medium animate-pulse">Verifying reset link securely... 🔒</p>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Password Reset Successful! 🎉</h2>
        <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
          Your new password has been secure and saved. You will be redirected to the login page in a few seconds...
        </p>
        <Button
          onClick={() => router.push('/login')}
          className="w-full rounded-2xl bg-neutral-900 text-white hover:bg-neutral-800 font-semibold py-3.5"
        >
          Go to Login Now
        </Button>
      </motion.div>
    )
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-100 shadow-sm">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2 text-center">Broken or Expired Link 🥺</h2>
        <p className="text-sm text-neutral-500 mb-8 text-center leading-relaxed">
          {error}
        </p>
        <Button
          onClick={() => router.push('/login')}
          className="w-full rounded-2xl bg-primary text-white hover:bg-primary-600 font-semibold py-3.5 flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Back to Login</span>
        </Button>
      </motion.div>
    )
  }

  // Password entry form
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold text-neutral-900 mb-1">Create New Password 🔐</h2>
      {email && (
        <p className="text-sm text-neutral-400 mb-6">
          Resetting password for <strong className="text-neutral-700 font-semibold">{email}</strong>
        </p>
      )}

      <form onSubmit={handleReset} className="space-y-5">
        <div className="relative">
          <Input
            id="password"
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 bottom-3.5 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Input
          id="confirmPassword"
          label="Confirm New Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* Real-time Validation Cues */}
        <div className="space-y-2 bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-xs text-neutral-500">
          <p className="font-semibold text-neutral-700">Security checklist:</p>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 6 ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
            <span className={password.length >= 6 ? 'text-emerald-700 font-medium' : ''}>At least 6 characters</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${password && password === confirmPassword ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
            <span className={password && password === confirmPassword ? 'text-emerald-700 font-medium' : ''}>Passwords match exactly</span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            loading={loading}
            disabled={password.length < 6 || password !== confirmPassword}
            className="w-full rounded-2xl bg-neutral-900 text-white hover:bg-neutral-800 font-semibold py-3.5 cursor-pointer shadow-md hover:shadow-lg transition-all"
          >
            Reset Password
          </Button>
        </div>
      </form>
    </motion.div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Aesthetic glowing background shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary-100 rounded-full blur-[120px] opacity-40 mix-blend-multiply filter pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary-200 rounded-full blur-[120px] opacity-40 mix-blend-multiply filter pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Intro */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/login" className="flex flex-col items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-300 to-primary flex items-center justify-center mb-4 shadow-md"
            >
              <span className="text-3xl">🐝</span>
            </motion.div>
            <h1 className="font-serif text-4xl text-neutral-900 tracking-tight italic">HelpHive</h1>
            <p className="text-sm text-neutral-400 mt-1 font-medium">Your cozy educational sweet spot 🍯</p>
          </Link>
        </div>

        {/* Custom Auth Box */}
        <div className="bg-white/80 backdrop-blur-md rounded-[32px] border border-neutral-100 p-8 shadow-xl overflow-hidden min-h-[380px] flex flex-col justify-center">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <p className="text-sm text-neutral-400 mt-4 font-medium animate-pulse">Loading secure environment... 🔒</p>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
