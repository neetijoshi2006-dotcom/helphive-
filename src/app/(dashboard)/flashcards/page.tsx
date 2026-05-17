'use client'

import { useState, useEffect } from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { ChevronLeft, ChevronRight, RotateCcw, Crown, Layers } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAppStore } from '@/lib/store/useAppStore'
import Link from 'next/link'

interface FlashcardItem {
  id: string
  question: string
  answer: string
  category: string
}

const DEFAULT_FLASHCARDS: FlashcardItem[] = [
  {
    id: 'default-1',
    question: "What is the powerhouse of the cell?",
    answer: "The Mitochondria",
    category: "Biology"
  },
  {
    id: 'default-2',
    question: "What process do plants use to convert sunlight into energy?",
    answer: "Photosynthesis",
    category: "Biology"
  },
  {
    id: 'default-3',
    question: "What is the basic unit of heredity?",
    answer: "Gene",
    category: "Biology"
  },
  {
    id: 'default-4',
    question: "Which molecule carries genetic information?",
    answer: "DNA (Deoxyribonucleic Acid)",
    category: "Biology"
  }
]

export default function FlashcardsPage() {
  const { user } = useAppStore()
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const isAdmin = user?.role === 'admin'


  // Fetch flashcards from Firestore
  useEffect(() => {
    async function fetchCards() {
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
            category: data.category || 'Biology'
          })
        })

        if (fetched.length > 0) {
          setFlashcards(fetched)
        } else {
          setFlashcards(DEFAULT_FLASHCARDS)
        }
      } catch (err) {
        console.error('Failed to fetch flashcards:', err)
        setFlashcards(DEFAULT_FLASHCARDS) // Graceful fallback
      } finally {
        setLoading(false)
      }
    }
    fetchCards()
  }, [])

  const handleNext = () => {
    if (flashcards.length === 0) return
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % flashcards.length)
  }

  const handlePrev = () => {
    if (flashcards.length === 0) return
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-400 font-medium">Shuffling flashcards...</p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-neutral-900">Study Flashcards 🗂️</h1>
            <p className="text-neutral-600 mt-0.5">Master the fundamentals of your subjects</p>
          </div>

          {/* Admin shortcut for flashcards */}
          {isAdmin && (
            <Link href="/admin/flashcards">
              <button className="flex items-center gap-2 bg-white border-2 border-neutral-150 text-neutral-900 px-5 py-3 rounded-2xl font-bold hover:bg-neutral-50 transition-all text-xs cursor-pointer shadow-sm">
                <Crown size={14} className="text-yellow-500 fill-yellow-400" />
                <span>Admin Panel</span>
              </button>
            </Link>
          )}
        </div>

        {flashcards.length === 0 ? (
          <div className="text-center py-20 bg-white border border-neutral-200 rounded-[3rem] p-10 shadow-sm">
            <div className="w-16 h-16 bg-neutral-50 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers size={28} />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 mb-1">No Flashcards Available</h3>
            <p className="text-neutral-500 max-w-sm mx-auto text-sm">Ask your administrator to load some flashcards in the admin dashboard!</p>
          </div>
        ) : (
          <>
            <div className="relative perspective-1000 h-[380px] mb-8">
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={`w-full h-full cursor-pointer transition-all duration-500 preserve-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white border-2 border-neutral-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 md:p-12 text-center shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold text-primary bg-primary-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      {flashcards[currentIndex].category}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      Question
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-neutral-900 leading-relaxed max-w-lg">
                    {flashcards[currentIndex].question}
                  </h2>
                  <p className="mt-auto text-neutral-400 text-xs italic">Click anywhere to flip and see answer 🪄</p>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden bg-neutral-100 border-2 border-neutral-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 md:p-12 text-center shadow-sm rotate-y-180">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold text-primary bg-primary-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      {flashcards[currentIndex].category}
                    </span>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      Answer
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-neutral-900 leading-relaxed max-w-lg">
                    {flashcards[currentIndex].answer}
                  </h2>
                  <p className="mt-auto text-neutral-400 text-xs italic">Click anywhere to flip back to question</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button 
                onClick={handlePrev}
                className="p-4 bg-white border-2 border-neutral-150 rounded-full hover:bg-neutral-50 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronLeft size={20} className="text-neutral-800" />
              </button>
              
              <div className="flex items-center gap-4">
                <span className="text-neutral-500 font-bold text-sm">
                  {currentIndex + 1} / {flashcards.length}
                </span>
                <button 
                  onClick={() => { setIsFlipped(false); setCurrentIndex(0); }}
                  className="p-2.5 text-neutral-400 hover:text-neutral-950 transition-colors cursor-pointer"
                  title="Reset to First Card"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              <button 
                onClick={handleNext}
                className="p-4 bg-white border-2 border-neutral-150 rounded-full hover:bg-neutral-50 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronRight size={20} className="text-neutral-800" />
              </button>
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  )
}


