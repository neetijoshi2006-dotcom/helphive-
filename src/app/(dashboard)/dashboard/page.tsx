'use client'

import { motion } from 'framer-motion'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useAppStore } from '@/lib/store/useAppStore'
import { getGreeting } from '@/lib/utils/format'
import { Plus, Flame, Star, BookOpen, Clock, Trophy, FileText, MessageSquare } from 'lucide-react'
import Link from 'next/link'

const item = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
})

export default function DashboardPage() {
  const { user } = useAppStore()

  return (
    <PageWrapper>
      <div className="grid grid-cols-3 gap-8 auto-rows-auto">
        {/* Welcome Hero — 2/3 width */}
        <motion.div {...item(0)} className="col-span-2">
          <Card className="relative overflow-hidden h-full min-h-[260px] flex flex-col justify-between bg-white border-neutral-200 shadow-sm">
            <div className="absolute top-0 right-0 w-80 h-80 bg-neutral-50 rounded-full -translate-y-1/3 translate-x-1/3 opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-neutral-400 mb-2">
                <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                <span>•</span>
                <span className="text-sm font-medium">✨ {getGreeting()}</span>
              </div>
              <h1 className="font-serif text-4xl text-neutral-900 mb-4 tracking-tight">
                Hey {user?.displayName?.split(' ')[0] || ''}, what are we <span className="italic underline decoration-neutral-200">learning today?</span> 🐝
              </h1>
              <p className="text-neutral-600 max-w-md leading-relaxed">
                You're on a <span className="font-bold text-neutral-900">5-day streak!</span> Keep it up and you'll reach your weekly goal by Friday.
              </p>
            </div>
            <div className="relative z-10 flex gap-4 mt-8">
              <Link href="/study-planner">
                <button className="bg-neutral-800 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-neutral-900/10">
                  Plan Study Session
                </button>
              </Link>
              <Link href="/quiz">
                <button className="bg-white border-2 border-neutral-100 text-neutral-900 px-8 py-4 rounded-2xl font-bold hover:bg-neutral-50 transition-all">
                  Take a Quiz
                </button>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Study Goal Tracker — 1/3 width */}
        <motion.div {...item(1)}>
          <Card className="h-full bg-neutral-100 text-neutral-900 border-neutral-200 flex flex-col justify-between p-8">
            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">Weekly Goal 🎯</h3>
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path className="text-neutral-200 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-neutral-900 stroke-current" strokeDasharray="75, 100" strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">75%</span>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">Done</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-neutral-300">12 / 16 hours completed</p>
              <p className="text-xs text-neutral-500 mt-1">4 hours left to reach your goal!</p>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div {...item(2)} className="col-span-3 grid grid-cols-4 gap-6">
          {[
            { label: 'Study Streak', value: '5 Days', icon: <Flame className="text-orange-500" />, bg: 'bg-orange-50' },
            { label: 'XP Earned', value: '1,240', icon: <Star className="text-yellow-600" />, bg: 'bg-yellow-50' },
            { label: 'Notes Shared', value: '24', icon: <BookOpen className="text-neutral-900" />, bg: 'bg-neutral-50' },
            { label: 'Global Rank', value: '#124', icon: <Trophy className="text-neutral-900" />, bg: 'bg-neutral-50' },
          ].map((stat, i) => (
            <Card key={i} className="flex items-center gap-4 p-6 bg-white border-neutral-100">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-neutral-900">{stat.value}</p>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Recent Community Feed Preview */}
        <motion.div {...item(3)} className="col-span-2">
          <Card className="h-full bg-white border-neutral-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Community Pulse 💬</h3>
              <Link href="/community" className="text-sm font-bold text-neutral-900 hover:underline">View Feed</Link>
            </div>
            <div className="space-y-4">
              {[
                { author: "Priya Singh", action: "asked a doubt", subject: "DBMS", content: "What is normalization in DBMS? 🤔", likes: 24 },
                { author: "Alex Chen", action: "shared notes", subject: "Biology", content: "Cell division cheat sheet 🧬", likes: 42 }
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-[2rem] bg-neutral-50 border border-neutral-100 group hover:border-neutral-200 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar name={item.author} size="sm" />
                    <div>
                      <span className="text-sm font-bold text-neutral-900">{item.author}</span>
                      <span className="text-xs text-neutral-400 ml-2">{item.action}</span>
                    </div>
                  </div>
                  <p className="text-neutral-800 font-medium mb-3">{item.content}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-neutral-900 bg-white border border-neutral-100 px-2.5 py-1 rounded-full uppercase tracking-tighter">#{item.subject}</span>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">✨ {item.likes} Likes</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div {...item(4)}>
          <Card className="h-full bg-white border-neutral-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Upcoming 📅</h3>
            </div>
            <div className="space-y-4">
              {[
                { title: 'DBMS Quiz', time: 'Today, 5 PM', icon: <Clock className="w-4 h-4" /> },
                { title: 'OS Summary', time: 'Tomorrow', icon: <FileText className="w-4 h-4" /> },
                { title: 'Math Final', time: 'Next Week', icon: <Star className="w-4 h-4" /> },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-4 p-2">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center shrink-0">
                    {task.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{task.title}</p>
                    <p className="text-xs text-neutral-400">{task.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
        
        {/* Quick Links / Study Tools */}
        <motion.div {...item(5)} className="col-span-3 grid grid-cols-3 gap-6 mt-2">
          <Link href="/community">
            <Card className="p-6 bg-white border-neutral-100 hover:border-neutral-300 transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare size={24} />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900">Community</h4>
                <p className="text-xs text-neutral-500">Discuss with peers</p>
              </div>
            </Card>
          </Link>
          <Link href="/flashcards">
            <Card className="p-6 bg-white border-neutral-100 hover:border-neutral-300 transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900">Flashcards</h4>
                <p className="text-xs text-neutral-500">Test your memory</p>
              </div>
            </Card>
          </Link>
          <Link href="/quiz">
            <Card className="p-6 bg-white border-neutral-100 hover:border-neutral-300 transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy size={24} />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900">Quiz</h4>
                <p className="text-xs text-neutral-500">Challenge yourself</p>
              </div>
            </Card>
          </Link>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
