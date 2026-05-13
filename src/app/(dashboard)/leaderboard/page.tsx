'use client'

import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { motion } from 'framer-motion'
import { Trophy, Medal, Star, Flame, Crown } from 'lucide-react'

// Mock data for the weekly leaderboard
const leaderboardData = [
  { id: '1', name: 'Emma Thompson', xp: 2450, streak: 14, rankChange: 'up' },
  { id: '2', name: 'Sophia Martinez', xp: 2320, streak: 10, rankChange: 'same' },
  { id: '3', name: 'Olivia Davis', xp: 2180, streak: 7, rankChange: 'up' },
  { id: '4', name: 'Ava Wilson', xp: 1950, streak: 5, rankChange: 'down' },
  { id: '5', name: 'Isabella Taylor', xp: 1840, streak: 12, rankChange: 'up' },
  { id: '6', name: 'Mia Anderson', xp: 1720, streak: 3, rankChange: 'down' },
  { id: '7', name: 'Charlotte Thomas', xp: 1650, streak: 8, rankChange: 'same' },
]

export default function LeaderboardPage() {
  const topThree = leaderboardData.slice(0, 3)
  const restOfLeaderboard = leaderboardData.slice(3)

  return (
    <PageWrapper>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
            Leaderboard <Trophy className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          </h1>
          <p className="text-neutral-500 mt-1">Weekly Rankings • Ends in 2 days</p>
        </div>
      </div>

      {/* Podium Section */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-8 mb-20 mt-12 h-auto">
        {/* 2nd Place */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full md:w-64 flex flex-col items-center"
        >
          <div className="relative mb-4">
            <Avatar name={topThree[1].name} size="lg" className="w-24 h-24 shadow-xl ring-4 ring-white" />
            <div className="absolute -bottom-2 -right-2 bg-white text-neutral-900 w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-neutral-50 shadow-md">
              2
            </div>
          </div>
          <Card className="w-full text-center bg-white border-neutral-100 p-6 shadow-sm">
            <p className="font-bold text-neutral-900 line-clamp-1">{topThree[1].name}</p>
            <p className="text-sm font-bold text-neutral-400 mt-1 uppercase tracking-widest">{topThree[1].xp} XP</p>
            <div className="flex items-center justify-center gap-1 text-xs text-neutral-900 mt-4 font-bold bg-neutral-50 py-2 rounded-xl px-4">
              <Flame className="w-4 h-4 text-orange-500" /> {topThree[1].streak} Days
            </div>
          </Card>
        </motion.div>

        {/* 1st Place */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full md:w-72 flex flex-col items-center z-10"
        >
          <div className="relative mb-6 scale-110">
            <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 w-10 h-10 text-yellow-500 fill-yellow-400 drop-shadow-xl" />
            <Avatar name={topThree[0].name} size="lg" className="w-32 h-32 shadow-2xl ring-4 ring-white" />
            <div className="absolute -bottom-3 -right-3 bg-neutral-900 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow-xl">
              1
            </div>
          </div>
          <Card className="w-full text-center bg-white border-neutral-200 p-8 shadow-xl scale-105">
            <p className="font-bold text-neutral-900 text-xl line-clamp-1">{topThree[0].name}</p>
            <p className="text-base font-bold text-neutral-900 mt-1 flex items-center justify-center gap-2">
              {topThree[0].xp} XP <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-white mt-6 font-bold bg-neutral-900 py-2.5 rounded-2xl w-full">
              <Flame className="w-5 h-5 text-orange-500" /> {topThree[0].streak} Day Streak
            </div>
          </Card>
        </motion.div>

        {/* 3rd Place */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full md:w-64 flex flex-col items-center"
        >
          <div className="relative mb-4">
            <Avatar name={topThree[2].name} size="lg" className="w-24 h-24 shadow-xl ring-4 ring-white" />
            <div className="absolute -bottom-2 -right-2 bg-white text-neutral-900 w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-neutral-50 shadow-md">
              3
            </div>
          </div>
          <Card className="w-full text-center bg-white border-neutral-100 p-6 shadow-sm">
            <p className="font-bold text-neutral-900 line-clamp-1">{topThree[2].name}</p>
            <p className="text-sm font-bold text-neutral-400 mt-1 uppercase tracking-widest">{topThree[2].xp} XP</p>
            <div className="flex items-center justify-center gap-1 text-xs text-neutral-900 mt-4 font-bold bg-neutral-50 py-2 rounded-xl px-4">
              <Flame className="w-4 h-4 text-orange-500" /> {topThree[2].streak} Days
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Remaining Leaderboard List */}
      <div className="max-w-2xl mx-auto space-y-4">
        {restOfLeaderboard.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card className="flex items-center gap-6 p-5 hover:shadow-xl transition-all group bg-white border-neutral-100">
              <div className="w-10 text-center font-bold text-neutral-400 group-hover:text-neutral-900 transition-colors">
                {index + 4}
              </div>
              <Avatar name={student.name} size="md" />
              <div className="flex-1">
                <p className="font-bold text-neutral-900">{student.name}</p>
                <div className="flex items-center gap-4 text-xs font-bold text-neutral-400 mt-1 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-neutral-400 group-hover:text-yellow-500 transition-colors" /> {student.xp} XP
                  </span>
                  <span className="flex items-center gap-1 group-hover:text-neutral-900 transition-colors">
                    <Flame className="w-3 h-3 text-orange-500" /> {student.streak} Streak
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-neutral-900">{student.xp}</div>
                <div className="text-[10px] font-bold text-neutral-300 uppercase tracking-tighter">Points</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  )
}
