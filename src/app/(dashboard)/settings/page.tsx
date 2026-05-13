'use client'

import { useState } from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { useAppStore } from '@/lib/store/useAppStore'
import { Save, User, Bell, Palette, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user } = useAppStore()
  const [name, setName] = useState(user?.displayName || '')
  const [email] = useState(user?.email || '')

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Settings ⚙️</h1>
        <p className="text-sm text-neutral-400 mt-0.5">Manage your account and workspace</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <Card className="bg-white border-neutral-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">Profile Settings</h3>
          </div>
          <div className="flex items-center gap-6 mb-8">
            <Avatar name={name || 'User'} size="lg" className="w-20 h-20 shadow-lg" />
            <button className="text-sm font-bold text-neutral-900 hover:underline">Change Profile Photo</button>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Display Name</label>
              <input 
                className="w-full px-5 py-4 rounded-2xl border-2 border-neutral-100 bg-white text-sm focus:outline-none focus:border-neutral-900 transition-all"
                value={name} 
                onChange={e => setName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                className="w-full px-5 py-4 rounded-2xl border-2 border-neutral-50 bg-neutral-50 text-sm text-neutral-400 cursor-not-allowed"
                value={email} 
                disabled 
              />
            </div>
          </div>
          <div className="flex justify-end mt-8 pt-6 border-t border-neutral-50">
            <button 
              onClick={() => toast.success('Settings saved ✨')}
              className="bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-neutral-900/10 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="bg-white border-neutral-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-neutral-50 text-neutral-900 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            {['Weekly progress report', 'New flashcard reminders', 'Community mention alerts', 'Study streak warnings'].map(item => (
              <label key={item} className="flex items-center justify-between py-3 cursor-pointer group">
                <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900 transition-colors">{item}</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-neutral-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                </div>
              </label>
            ))}
          </div>
        </Card>

        {/* Appearance */}
        <Card className="bg-white border-neutral-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-neutral-50 text-neutral-900 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">Appearance</h3>
          </div>
          <div className="flex gap-4">
            {['Minimalist', 'Classic', 'Dark'].map(theme => (
              <button key={theme} className={`px-8 py-4 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${theme === 'Minimalist' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-400 border-neutral-100 hover:border-neutral-200'}`}>
                {theme}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  )
}
