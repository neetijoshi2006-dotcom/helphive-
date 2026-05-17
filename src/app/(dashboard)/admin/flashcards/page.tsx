'use client'

import { useState, useEffect } from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, BookOpen, Check, ArrowLeft, Sparkles, ShieldAlert, Layers } from 'lucide-react'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAppStore } from '@/lib/store/useAppStore'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface FlashcardItem {
  id: string
  question: string
  answer: string
  category: string
}

const DEFAULT_FLASHCARDS = [
  {
    question: "What is the powerhouse of the cell?",
    answer: "The Mitochondria",
    category: "Biology"
  },
  {
    question: "What process do plants use to convert sunlight into energy?",
    answer: "Photosynthesis",
    category: "Biology"
  },
  {
    question: "What is the basic unit of heredity?",
    answer: "Gene",
    category: "Biology"
  },
  {
    question: "Which molecule carries genetic information?",
    answer: "DNA (Deoxyribonucleic Acid)",
    category: "Biology"
  }
]

export default function AdminFlashcardsPage() {
  const { user } = useAppStore()
  const [cards, setCards] = useState<FlashcardItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form State
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState('Biology')
  const [submitting, setSubmitting] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // Security Check: Only allow 'admin' role or the owner's primary email address
  const isAdmin = user?.role === 'admin' || user?.email === 'neetijoshi2006@gmail.com'

  // Fetch flashcards from Firestore
  async function fetchFlashcards() {
    if (!isAdmin) return
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'flashcards'))
      const fetched: FlashcardItem[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        fetched.push({
          id: doc.id,
          question: data.question,
          answer: data.answer,
          category: data.category || 'General'
        })
      })
      setCards(fetched)
    } catch (err) {
      console.error('Failed to fetch flashcards:', err)
      toast.error('Could not connect to database 🥺')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchFlashcards()
    }
  }, [user])

  // Handle adding a flashcard
  async function handleAddCard(e: React.FormEvent) {
    e.preventDefault()
    if (!isAdmin) return
    if (!question.trim()) {
      toast.error('Please enter a question!')
      return
    }
    if (!answer.trim()) {
      toast.error('Please enter the answer!')
      return
    }

    setSubmitting(true)
    try {
      const newCardData = {
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim(),
        createdAt: new Date()
      }

      await addDoc(collection(db, 'flashcards'), newCardData)
      toast.success('New flashcard added! 🗂️')
      
      // Reset Form
      setQuestion('')
      setAnswer('')
      setCategory('Biology')
      setShowAddForm(false)
      
      fetchFlashcards()
    } catch (err) {
      console.error('Failed to add flashcard:', err)
      toast.error('Failed to save flashcard 🥺')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle deleting a flashcard
  async function handleDeleteCard(id: string) {
    if (!isAdmin) return
    if (!confirm('Are you sure you want to delete this flashcard?')) return

    try {
      await deleteDoc(doc(db, 'flashcards', id))
      toast.success('Flashcard deleted! 🗑️')
      setCards(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Failed to delete flashcard:', err)
      toast.error('Failed to delete flashcard 🥺')
    }
  }

  // Handle seeding initial flashcards
  async function seedInitialFlashcards() {
    if (!isAdmin) return
    setSubmitting(true)
    try {
      for (const card of DEFAULT_FLASHCARDS) {
        await addDoc(collection(db, 'flashcards'), {
          ...card,
          createdAt: new Date()
        })
      }
      toast.success('Successfully loaded starter flashcards! 🍯')
      fetchFlashcards()
    } catch (err) {
      console.error('Failed to seed:', err)
      toast.error('Failed to import starter flashcards')
    } finally {
      setSubmitting(false)
    }
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
            This area is restricted to administrators only. You do not have permissions to access the flashcard management panels.
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
            <Link href="/flashcards">
              <button className="p-2.5 rounded-2xl bg-white border border-neutral-100 hover:bg-neutral-50 text-neutral-600 transition-all shadow-sm">
                <ArrowLeft size={18} />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
                Flashcards Admin Panel 👑
              </h1>
              <p className="text-sm text-neutral-500 mt-0.5">Manage and add flashcards for everyone in HelpHive</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-neutral-900/10 cursor-pointer text-sm"
          >
            <Plus size={16} />
            <span>{showAddForm ? 'Hide Form' : 'Add Flashcard'}</span>
          </button>
        </div>

        {/* Create Flashcard Form */}
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
                  <Sparkles className="text-primary w-5 h-5" /> Design a New Flashcard
                </h2>
                
                <form onSubmit={handleAddCard} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-neutral-600 mb-2">Subject / Category</label>
                      <Input
                        id="category"
                        placeholder="e.g., Biology, Chemistry, General History 🎓"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-neutral-600 mb-2">Question (Front of Card)</label>
                    <textarea
                      placeholder="e.g., What is the primary function of Mitochondria? 🧬"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      required
                      rows={3}
                      className="w-full rounded-2xl border-2 border-neutral-150 p-4 text-neutral-800 focus:border-neutral-900 focus:outline-none transition-all placeholder-neutral-300 resize-none font-medium leading-relaxed shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-neutral-600 mb-2">Answer (Back of Card)</label>
                    <textarea
                      placeholder="e.g., Producing energy in the form of ATP molecules."
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      required
                      rows={3}
                      className="w-full rounded-2xl border-2 border-neutral-150 p-4 text-neutral-800 focus:border-neutral-900 focus:outline-none transition-all placeholder-neutral-300 resize-none font-medium leading-relaxed shadow-inner"
                    />
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
                      Publish Flashcard 🗂️
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flashcard list */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-400 font-medium">Fetching active flashcards...</p>
          </div>
        ) : cards.length === 0 ? (
          <Card className="text-center py-16 bg-white border-neutral-100 p-8 shadow-sm">
            <div className="w-16 h-16 bg-neutral-50 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers size={28} />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 mb-1">No Custom Flashcards Yet</h3>
            <p className="text-neutral-500 max-w-sm mx-auto mb-6 text-sm">Create some custom study flashcards, or seed the starter cards for HelpHive!</p>
            
            <div className="flex justify-center gap-3">
              <button
                onClick={seedInitialFlashcards}
                disabled={submitting}
                className="bg-neutral-100 border border-neutral-200 text-neutral-800 hover:bg-neutral-200 font-bold px-6 py-3 rounded-2xl text-sm transition-all"
              >
                Import Starter Flashcards 🍯
              </button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Active Flashcards ({cards.length})</h3>
            
            {cards.map((card, cIdx) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: cIdx * 0.05 }}
              >
                <Card className="bg-white border-neutral-150 p-6 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="text-[10px] font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                          Card {cIdx + 1}
                        </span>
                        <span className="text-[10px] font-bold text-primary bg-primary-50 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                          {card.category}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                          <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-2">Front (Question)</p>
                          <p className="font-semibold text-neutral-900 leading-relaxed">{card.question}</p>
                        </div>
                        <div className="p-4 bg-primary-50/30 rounded-2xl border border-primary-100/50">
                          <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">Back (Answer)</p>
                          <p className="font-semibold text-neutral-800 leading-relaxed">{card.answer}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-2.5 rounded-xl border border-transparent hover:border-red-100 hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-all shrink-0 cursor-pointer self-start"
                      title="Delete Flashcard"
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
