'use client'

import { useState } from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { Sparkles, CalendarDays, BookOpen, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'

export default function StudyPlannerPage() {
  const [syllabus, setSyllabus] = useState('')
  const [datesheet, setDatesheet] = useState('')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<string | null>(null)

  const generatePlanner = async () => {
    if (!syllabus.trim() || !datesheet.trim()) {
      toast.error('Please fill in both your syllabus and datesheet! 🎀')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/ai/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syllabus, datesheet })
      })

      if (!res.ok) throw new Error('Failed to generate')
      const data = await res.json()
      setPlan(data.plan)
      toast.success('Your magical study plan is ready! ✨')
    } catch (err) {
      toast.error('Failed to create the plan. Try again! 🌸')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Study Planner 📅</h1>
          <p className="text-sm text-neutral-400 mt-0.5">Let HiveAI organize your study schedule!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Input Form */}
        <Card className="flex flex-col gap-6 bg-white border-neutral-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">Course Materials</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Syllabus Details</label>
              <textarea 
                className="w-full px-5 py-4 rounded-2xl border-2 border-neutral-100 bg-white text-sm focus:outline-none focus:border-neutral-900 transition-all min-h-[150px]"
                placeholder="Paste your topics here (e.g., Module 1: CPU Scheduling...)"
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">Exams & Deadlines</label>
              <textarea 
                className="w-full px-5 py-4 rounded-2xl border-2 border-neutral-100 bg-white text-sm focus:outline-none focus:border-neutral-900 transition-all min-h-[120px]"
                placeholder="e.g., Nov 12 - Operating Systems..."
                value={datesheet}
                onChange={(e) => setDatesheet(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={generatePlanner} 
            disabled={loading}
            className="w-full bg-neutral-900 text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-neutral-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Generate Magic Planner
          </button>
        </Card>

        {/* Right: Generated Plan */}
        <Card className="min-h-[550px] h-full flex flex-col bg-white border-neutral-100 relative overflow-hidden p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8 relative z-10 border-b border-neutral-50 pb-6">
            <div className="w-10 h-10 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5 text-neutral-900" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">Your Custom Schedule</h2>
          </div>

          <div className="flex-1 relative z-10 overflow-y-auto">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="flex gap-2 mb-6">
                  <span className="w-3 h-3 bg-neutral-900 rounded-full animate-bounce" style={{animationDelay:'0ms'}}/>
                  <span className="w-3 h-3 bg-neutral-900 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/>
                  <span className="w-3 h-3 bg-neutral-900 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/>
                </div>
                <p className="text-lg font-bold text-neutral-900">HiveAI is mapping out your success...</p>
                <p className="text-sm text-neutral-400 mt-2 italic">Brewing some focus potions! ☕</p>
              </div>
            ) : plan ? (
              <div className="prose prose-neutral max-w-none text-neutral-800">
                <ReactMarkdown>{plan}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">🧙‍♀️</span>
                </div>
                <p className="text-xl font-bold text-neutral-900">No plan yet!</p>
                <p className="text-sm text-neutral-400 mt-2 max-w-[280px] leading-relaxed">
                  Drop your syllabus and exam dates on the left, and let the magic begin!
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageWrapper>
  )
}
