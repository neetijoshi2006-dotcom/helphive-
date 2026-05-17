'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { useAppStore } from '@/lib/store/useAppStore'
import { getGreeting } from '@/lib/utils/format'
import { Plus, Flame, Star, BookOpen, Clock, Trophy, FileText, MessageSquare, Sparkles } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const item = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
})

interface UserStats {
  streak: number
  xp: number
  notesShared: number
  goalHoursCompleted: number
  goalHoursTarget: number
  rank: string
}

export default function DashboardPage() {
  const { user } = useAppStore()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loggingHours, setLoggingHours] = useState(false)

  // Initialize and load stats dynamically for the logged-in user
  useEffect(() => {
    if (!user?.uid) return
    const key = `helphive_user_stats_${user.uid}`
    const saved = localStorage.getItem(key)
    if (saved) {
      setStats(JSON.parse(saved))
    } else {
      const initial: UserStats = {
        streak: 0,
        xp: 0,
        notesShared: 0,
        goalHoursCompleted: 0,
        goalHoursTarget: 16,
        rank: 'Unranked 🥉'
      }
      localStorage.setItem(key, JSON.stringify(initial))
      setStats(initial)
    }
  }, [user?.uid])

  // Log study hours dynamically
  const logStudyHours = () => {
    if (!user?.uid || !stats) return
    setLoggingHours(true)
    setTimeout(() => {
      const key = `helphive_user_stats_${user.uid}`
      const updated = {
        ...stats,
        goalHoursCompleted: Math.min(stats.goalHoursCompleted + 2, stats.goalHoursTarget),
        xp: stats.xp + 50 // Reward 50 XP for studying!
      }
      localStorage.setItem(key, JSON.stringify(updated))
      setStats(updated)
      setLoggingHours(false)
      toast.success('Logged 2 study hours! Keep going! ⏰✨')
    }, 600)
  }

  // Calculate percentage safely
  const completedHours = stats?.goalHoursCompleted ?? 0
  const targetHours = stats?.goalHoursTarget ?? 16
  const progressPercentage = Math.round((completedHours / targetHours) * 100)
  const dashArrayValue = (progressPercentage / 100) * 100

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-auto">
        {/* Welcome Hero — 2/3 width */}
        <motion.div {...item(0)} className="col-span-1 lg:col-span-2">
          <Card className="relative overflow-hidden h-full min-h-[260px] flex flex-col justify-between bg-white border-neutral-200 shadow-sm p-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-neutral-50 rounded-full -translate-y-1/3 translate-x-1/3 opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-neutral-450 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                <span>•</span>
                <span className="text-xs font-bold uppercase tracking-wider">✨ {getGreeting()}</span>
              </div>
              <h1 className="font-serif text-4xl text-neutral-900 mb-4 tracking-tight leading-tight">
                Hey {user?.displayName?.split(' ')[0] || ''}, what are we <span className="italic underline decoration-neutral-250">learning today?</span> 🐝
              </h1>
              <p className="text-neutral-600 max-w-md leading-relaxed text-sm">
                {stats?.streak && stats.streak > 0 ? (
                  <>You're on a <span className="font-bold text-neutral-900">{stats.streak}-day streak!</span> Keep it up and you'll reach your goals in no time.</>
                ) : (
                  <>Welcome to your new digital hive! Plan your first study session or take a quiz to start your streak. 🍯</>
                )}
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-4 mt-8">
              <Link href="/study-planner">
                <button className="bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-neutral-900/10 cursor-pointer text-sm">
                  Plan Study Session
                </button>
              </Link>
              <Link href="/quiz">
                <button className="bg-white border-2 border-neutral-150 text-neutral-900 px-8 py-4 rounded-2xl font-bold hover:bg-neutral-50 transition-all cursor-pointer text-sm">
                  Take a Quiz
                </button>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Study Goal Tracker — 1/3 width */}
        <motion.div {...item(1)} className="col-span-1">
          <Card className="h-full bg-neutral-900 text-white border-neutral-850 flex flex-col justify-between p-8 rounded-[2.5rem]">
            <div>
              <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-6">Weekly Goal 🎯</h3>
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path className="text-neutral-800 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path 
                    className="text-white stroke-current transition-all duration-500" 
                    strokeDasharray={`${dashArrayValue}, 100`} 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    fill="none" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{progressPercentage}%</span>
                  <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">Done</span>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div>
                <p className="text-xs font-semibold text-neutral-300">{completedHours} / {targetHours} hours completed</p>
                <p className="text-[10px] text-neutral-450 mt-1">
                  {completedHours >= targetHours 
                    ? 'Goal achieved! You are a superstar study bee! 🌟🍯' 
                    : `${targetHours - completedHours} hours left to reach your weekly goal!`}
                </p>
              </div>

              <button
                onClick={logStudyHours}
                disabled={loggingHours || completedHours >= targetHours}
                className="w-full bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-xs py-3 px-4 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {loggingHours ? 'Logging...' : 'Log 2 Study Hours ⏰'}
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div {...item(2)} className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[
            { label: 'Study Streak', value: stats?.streak !== undefined ? `${stats.streak} Days` : '0 Days', icon: <Flame className="text-orange-500 w-5 h-5 md:w-6 md:h-6" />, bg: 'bg-orange-50' },
            { label: 'XP Earned', value: stats?.xp !== undefined ? stats.xp.toLocaleString() : '0', icon: <Star className="text-yellow-600 w-5 h-5 md:w-6 md:h-6" />, bg: 'bg-yellow-50' },
            { label: 'Notes Shared', value: stats?.notesShared !== undefined ? `${stats.notesShared}` : '0', icon: <BookOpen className="text-neutral-900 w-5 h-5 md:w-6 md:h-6" />, bg: 'bg-neutral-50' },
            { label: 'Global Rank', value: stats?.rank || 'Bronze V', icon: <Trophy className="text-neutral-900 w-5 h-5 md:w-6 md:h-6" />, bg: 'bg-neutral-50' },
          ].map((stat, i) => (
            <Card key={i} className="flex items-center gap-2 xs:gap-3 md:gap-4 p-3.5 xs:p-4 md:p-6 bg-white border-neutral-100 shadow-sm rounded-2xl min-w-0">
              <div className={`w-9 h-9 xs:w-10 xs:h-10 md:w-12 md:h-12 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
                {stat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-widest truncate">{stat.label}</p>
                <p className="text-sm xs:text-base md:text-xl font-bold text-neutral-900 mt-0.5 truncate" title={stat.value}>{stat.value}</p>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Recent Community Feed Preview */}
        <motion.div {...item(3)} className="col-span-1 lg:col-span-2">
          <Card className="h-full bg-white border-neutral-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Community Pulse 💬</h3>
              <Link href="/community" className="text-xs font-bold text-neutral-900 hover:underline">View Feed</Link>
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
                  <p className="text-neutral-800 font-medium mb-3 text-sm">{item.content}</p>
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
        <motion.div {...item(4)} className="col-span-1">
          <Card className="h-full bg-white border-neutral-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Upcoming 📅</h3>
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
                    <p className="text-xs text-neutral-400 mt-0.5">{task.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
        
        {/* Quick Links / Study Tools */}
        <motion.div {...item(5)} className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          <Link href="/community">
            <Card className="p-6 bg-white border-neutral-100 hover:border-neutral-300 transition-all flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare size={24} />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-sm">Community</h4>
                <p className="text-xs text-neutral-500">Discuss with peers</p>
              </div>
            </Card>
          </Link>
          <Link href="/flashcards">
            <Card className="p-6 bg-white border-neutral-100 hover:border-neutral-300 transition-all flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-sm">Flashcards</h4>
                <p className="text-xs text-neutral-500">Test your memory</p>
              </div>
            </Card>
          </Link>
          <Link href="/quiz">
            <Card className="p-6 bg-white border-neutral-100 hover:border-neutral-300 transition-all flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy size={24} />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-sm">Quiz</h4>
                <p className="text-xs text-neutral-500">Challenge yourself</p>
              </div>
            </Card>
          </Link>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
