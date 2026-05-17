'use client'

import { useState, useEffect } from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, XCircle, Trophy, ArrowRight, RefreshCcw, Sparkles, BookOpen, Crown } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAppStore } from '@/lib/store/useAppStore'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
}

const DEFAULT_QUIZZES: QuizQuestion[] = [
  {
    id: 'default-1',
    question: "Which of the following is NOT a fundamental force of nature?",
    options: ["Gravity", "Electromagnetism", "Centrifugal Force", "Strong Nuclear Force"],
    correct: 2
  },
  {
    id: 'default-2',
    question: "What is the chemical symbol for Gold?",
    options: ["Ag", "Au", "Pb", "Fe"],
    correct: 1
  },
  {
    id: 'default-3',
    question: "Who developed the theory of general relativity?",
    options: ["Isaac Newton", "Nikola Tesla", "Albert Einstein", "Marie Curie"],
    correct: 2
  }
]

export default function QuizPage() {
  const { user } = useAppStore()
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  // Fetch quizzes from Firestore
  useEffect(() => {
    async function fetchQuizzes() {
      setLoading(true)
      try {
        const querySnapshot = await getDocs(collection(db, 'quizzes'))
        const fetched: QuizQuestion[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          fetched.push({
            id: doc.id,
            question: data.question,
            options: data.options,
            correct: data.correct
          })
        })

        // Fallback to defaults if no custom quizzes exist
        if (fetched.length > 0) {
          setQuizzes(fetched)
        } else {
          setQuizzes(DEFAULT_QUIZZES)
        }
      } catch (err) {
        console.error('Failed to fetch quizzes:', err)
        setQuizzes(DEFAULT_QUIZZES) // Graceful fallback
      } finally {
        setLoading(false)
      }
    }
    fetchQuizzes()
  }, [])

  const handleSubmit = () => {
    if (selectedOption === null) return
    
    if (selectedOption === quizzes[currentStep].correct) {
      setScore(prev => prev + 1)
    }
    setIsSubmitted(true)
  }

  const handleNext = () => {
    if (currentStep < quizzes.length - 1) {
      setCurrentStep(prev => prev + 1)
      setSelectedOption(null)
      setIsSubmitted(false)
    } else {
      setIsFinished(true)
      awardUserStats()
    }
  }

  // Update user stats in localStorage upon completing a quiz!
  const awardUserStats = () => {
    if (!user?.uid) return
    const key = `helphive_user_stats_${user.uid}`
    const saved = localStorage.getItem(key)
    
    let stats = {
      streak: 0,
      xp: 0,
      notesShared: 0,
      goalHoursCompleted: 0,
      goalHoursTarget: 16,
      rank: 'Bronze V'
    }

    if (saved) {
      stats = JSON.parse(saved)
    }

    // Award XP: +100 XP per correct answer, +50 bonus XP for completing!
    const earnedXP = (score * 100) + 50
    stats.xp += earnedXP
    stats.streak = stats.streak === 0 ? 1 : stats.streak + 1
    
    // Dynamically calculate rank based on XP
    if (stats.xp >= 2000) stats.rank = 'Gold I 👑'
    else if (stats.xp >= 1000) stats.rank = 'Silver III 🥈'
    else if (stats.xp >= 300) stats.rank = 'Bronze I 🥉'
    else stats.rank = 'Bronze V'

    localStorage.setItem(key, JSON.stringify(stats))
    toast.success(`You earned +${earnedXP} XP! 🏆 Streak increased!`)
  }

  const resetQuiz = () => {
    setCurrentStep(0)
    setSelectedOption(null)
    setIsSubmitted(false)
    setScore(0)
    setIsFinished(false)
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-400 font-medium">Preparing questions...</p>
        </div>
      </PageWrapper>
    )
  }

  if (isFinished) {
    const earnedXP = (score * 100) + 50
    return (
      <PageWrapper>
        <div className="max-w-xl mx-auto text-center py-16 bg-white border border-neutral-200 rounded-[3rem] p-12 shadow-sm mt-10">
          <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={40} />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Quiz Completed!</h2>
          <p className="text-neutral-600 mb-6">You scored {score} out of {quizzes.length}</p>
          
          <div className="bg-neutral-50 rounded-2xl p-5 mb-8 border border-neutral-100 flex items-center justify-around">
            <div>
              <p className="text-xs text-neutral-400 uppercase font-bold tracking-wider mb-1">XP Gained</p>
              <p className="text-xl font-bold text-neutral-900">+{earnedXP} XP 🌟</p>
            </div>
            <div className="h-8 w-[1px] bg-neutral-200" />
            <div>
              <p className="text-xs text-neutral-400 uppercase font-bold tracking-wider mb-1">Streak</p>
              <p className="text-xl font-bold text-neutral-900">Increased! 🔥</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={resetQuiz}
              className="w-full bg-neutral-900 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm cursor-pointer"
            >
              <RefreshCcw size={20} />
              Try Again
            </button>
            <Link href="/dashboard">
              <button className="w-full bg-white border-2 border-neutral-150 text-neutral-900 py-4 rounded-2xl font-semibold hover:bg-neutral-50 transition-all">
                Return to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
              Daily Quiz 🎯
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5">Test your intelligence and win daily study points</p>
          </div>

          {/* Admin shortcut visible only to the admin for adding questions */}
          {user?.role === 'admin' && (

            <Link href="/admin/quizzes">
              <button className="flex items-center gap-2 bg-white border-2 border-neutral-150 text-neutral-900 px-5 py-3 rounded-2xl font-bold hover:bg-neutral-50 transition-all text-xs cursor-pointer shadow-sm">
                <Crown size={14} className="text-yellow-500 fill-yellow-400" />
                <span>Admin Panel</span>
              </button>
            </Link>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Question {currentStep + 1} of {quizzes.length}</span>
            <span className="text-xs font-bold text-neutral-950 uppercase tracking-widest">Score: {score}</span>
          </div>
          <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-neutral-800 transition-all duration-500" 
              style={{ width: `${((currentStep + 1) / quizzes.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-[2.5rem] p-10 shadow-sm">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 leading-snug">
            {quizzes[currentStep]?.question}
          </h2>

          <div className="space-y-4">
            {quizzes[currentStep]?.options.map((option, index) => {
              const isCorrect = index === quizzes[currentStep].correct
              const isSelected = index === selectedOption
              
              let variantClasses = "border-neutral-150 hover:border-neutral-300"
              if (isSubmitted) {
                if (isCorrect) variantClasses = "border-green-500 bg-green-50/50 text-green-900"
                else if (isSelected) variantClasses = "border-red-500 bg-red-50/50 text-red-900"
                else variantClasses = "border-neutral-100 opacity-50"
              } else if (isSelected) {
                variantClasses = "border-neutral-900 bg-neutral-50"
              }

              return (
                <button
                  key={index}
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(index)}
                  className={`w-full flex items-center justify-between p-5 border-2 rounded-2xl transition-all text-left group cursor-pointer ${variantClasses}`}
                >
                  <span className="font-bold text-neutral-800 text-sm">{option}</span>
                  {isSubmitted && isCorrect && <CheckCircle2 className="text-green-600" size={20} />}
                  {isSubmitted && isSelected && !isCorrect && <XCircle className="text-red-600" size={20} />}
                </button>
              )
            })}
          </div>

          <div className="mt-10">
            {!isSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={handleSubmit}
                className="w-full bg-neutral-900 text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full bg-neutral-950 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all animate-fade-in shadow-md cursor-pointer"
              >
                {currentStep < quizzes.length - 1 ? "Next Question" : "View Results"}
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
