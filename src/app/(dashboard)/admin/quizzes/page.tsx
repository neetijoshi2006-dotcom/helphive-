'use client'

import { useState, useEffect } from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, BookOpen, Check, ArrowLeft, Trophy, Sparkles, ShieldAlert } from 'lucide-react'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
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

const DEFAULT_QUIZZES = [
  {
    question: "Which of the following is NOT a fundamental force of nature?",
    options: ["Gravity", "Electromagnetism", "Centrifugal Force", "Strong Nuclear Force"],
    correct: 2
  },
  {
    question: "What is the chemical symbol for Gold?",
    options: ["Ag", "Au", "Pb", "Fe"],
    correct: 1
  },
  {
    question: "Who developed the theory of general relativity?",
    options: ["Isaac Newton", "Nikola Tesla", "Albert Einstein", "Marie Curie"],
    correct: 2
  }
]

export default function AdminQuizzesPage() {
  const { user } = useAppStore()
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form State
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // Security Check: Only allow 'admin' role or the owner's primary email address
  const isAdmin = user?.role === 'admin' || user?.email === 'neetijoshi2006@gmail.com'

  // Fetch quizzes from Firestore
  async function fetchQuizzes() {
    if (!isAdmin) return
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
      setQuizzes(fetched)
    } catch (err) {
      console.error('Failed to fetch quizzes:', err)
      toast.error('Could not connect to database 🥺')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchQuizzes()
    }
  }, [user])

  // Handle adding a quiz
  async function handleAddQuiz(e: React.FormEvent) {
    e.preventDefault()
    if (!isAdmin) return
    if (!question.trim()) {
      toast.error('Please enter a question!')
      return
    }
    if (options.some(opt => !opt.trim())) {
      toast.error('Please fill in all 4 options!')
      return
    }

    setSubmitting(true)
    try {
      const newQuizData = {
        question: question.trim(),
        options: options.map(o => o.trim()),
        correct: correctIndex,
        createdAt: new Date()
      }

      await addDoc(collection(db, 'quizzes'), newQuizData)
      toast.success('New quiz question added! 🎯')
      
      // Reset Form
      setQuestion('')
      setOptions(['', '', '', ''])
      setCorrectIndex(0)
      setShowAddForm(false)
      
      fetchQuizzes()
    } catch (err) {
      console.error('Failed to add quiz:', err)
      toast.error('Failed to save quiz to Firestore 🥺')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle deleting a quiz
  async function handleDeleteQuiz(id: string) {
    if (!isAdmin) return
    if (!confirm('Are you sure you want to delete this quiz question?')) return

    try {
      await deleteDoc(doc(db, 'quizzes', id))
      toast.success('Quiz question deleted! 🗑️')
      setQuizzes(prev => prev.filter(q => q.id !== id))
    } catch (err) {
      console.error('Failed to delete quiz:', err)
      toast.error('Failed to delete question 🥺')
    }
  }

  // Handle seeding initial quizzes
  async function seedInitialQuizzes() {
    if (!isAdmin) return
    setSubmitting(true)
    try {
      for (const quiz of DEFAULT_QUIZZES) {
        await addDoc(collection(db, 'quizzes'), {
          ...quiz,
          createdAt: new Date()
        })
      }
      toast.success('Successfully loaded starter quizzes! 🍯')
      fetchQuizzes()
    } catch (err) {
      console.error('Failed to seed:', err)
      toast.error('Failed to import starter quizzes')
    } finally {
      setSubmitting(false)
    }
  }

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options]
    updated[index] = val
    setOptions(updated)
  }

  // Render Access Denied for non-admin users
  if (!isAdmin) {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto text-center py-20 bg-white border border-neutral-200 rounded-[3rem] p-10 shadow-sm mt-12">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-3">Access Denied 🔒</h2>
          <p className="text-neutral-500 text-sm leading-relaxed mb-8">
            This area is restricted to administrators only. You do not have permissions to access the quiz management panels.
          </p>
          <Link href="/dashboard">
            <button className="w-full bg-neutral-900 text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition-all cursor-pointer">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto py-6">
        {/* Header navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link href="/quiz">
              <button className="p-2.5 rounded-2xl bg-white border border-neutral-100 hover:bg-neutral-50 text-neutral-600 transition-all shadow-sm">
                <ArrowLeft size={18} />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
                Quiz Admin Panel 👑
              </h1>
              <p className="text-sm text-neutral-500 mt-0.5">Manage and add quiz questions for everyone in HelpHive</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-neutral-900/10 cursor-pointer text-sm"
          >
            <Plus size={16} />
            <span>{showAddForm ? 'Hide Form' : 'Add Question'}</span>
          </button>
        </div>

        {/* Create Question Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <Card className="bg-white border-neutral-200 shadow-xl p-8 rounded-[2.5rem]">
                <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                  <Sparkles className="text-primary w-5 h-5" /> Design a New Quiz Question
                </h2>
                
                <form onSubmit={handleAddQuiz} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-neutral-600 mb-2">Question Title</label>
                    <textarea
                      placeholder="e.g., What is the primary function of Mitochondria in a cell? 🧬"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      required
                      rows={3}
                      className="w-full rounded-2xl border-2 border-neutral-150 p-4 text-neutral-800 focus:border-neutral-900 focus:outline-none transition-all placeholder-neutral-300 resize-none font-medium leading-relaxed shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map((opt, idx) => (
                      <div key={idx} className="relative">
                        <label className="block text-xs font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">
                          Option {idx + 1}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={`Enter answer option ${idx + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                            required
                            className="w-full rounded-2xl border-2 border-neutral-150 px-4 py-3.5 text-sm text-neutral-800 focus:border-neutral-900 focus:outline-none transition-all placeholder-neutral-300 font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setCorrectIndex(idx)}
                            className={`px-4 rounded-2xl border-2 font-bold text-xs transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                              correctIndex === idx 
                                ? 'bg-green-50/50 border-green-500 text-green-800 font-bold' 
                                : 'bg-white border-neutral-150 text-neutral-400 hover:border-neutral-300'
                            }`}
                          >
                            {correctIndex === idx ? <Check size={16} /> : 'Set Correct'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-neutral-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                      className="rounded-2xl border-2 border-neutral-200 px-6 font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={submitting}
                      className="rounded-2xl bg-neutral-900 text-white hover:bg-neutral-800 px-8 font-semibold shadow-md"
                    >
                      Publish Question 🎯
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quiz list */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-400 font-medium">Fetching active quizzes...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <Card className="text-center py-16 bg-white border-neutral-100 p-8 shadow-sm">
            <div className="w-16 h-16 bg-neutral-50 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 mb-1">No Custom Quizzes Yet</h3>
            <p className="text-neutral-500 max-w-sm mx-auto mb-6 text-sm">Create some custom quiz questions, or seed the starter questions for HelpHive!</p>
            
            <div className="flex justify-center gap-3">
              <button
                onClick={seedInitialQuizzes}
                disabled={submitting}
                className="bg-neutral-100 border border-neutral-200 text-neutral-800 hover:bg-neutral-200 font-bold px-6 py-3 rounded-2xl text-sm transition-all"
              >
                Import Starter Quizzes 🍯
              </button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Active Questions ({quizzes.length})</h3>
            
            {quizzes.map((quiz, qIdx) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qIdx * 0.05 }}
              >
                <Card className="bg-white border-neutral-150 p-6 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="text-[10px] font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                          Q{qIdx + 1}
                        </span>
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1">
                          <Check size={10} /> Option {quiz.correct + 1} Correct
                        </span>
                      </div>
                      <h4 className="font-bold text-neutral-900 text-lg leading-relaxed mb-4">
                        {quiz.question}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                        {quiz.options.map((opt, oIdx) => (
                          <div 
                            key={oIdx} 
                            className={`flex items-center gap-2 p-3 border rounded-xl text-sm font-medium ${
                              oIdx === quiz.correct 
                                ? 'bg-green-50/50 border-green-200 text-green-800' 
                                : 'bg-neutral-50 border-neutral-100 text-neutral-600'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-white border flex items-center justify-center text-[10px] font-bold shrink-0">
                              {oIdx + 1}
                            </span>
                            <span className="truncate">{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="p-2.5 rounded-xl border border-transparent hover:border-red-100 hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-all shrink-0 cursor-pointer self-start"
                      title="Delete Question"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
