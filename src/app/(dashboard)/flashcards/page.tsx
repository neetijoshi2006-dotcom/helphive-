'use client'

import { useState } from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'

const biologyFlashcards = [
  {
    id: 1,
    question: "What is the powerhouse of the cell?",
    answer: "The Mitochondria"
  },
  {
    id: 2,
    question: "What process do plants use to convert sunlight into energy?",
    answer: "Photosynthesis"
  },
  {
    id: 3,
    question: "What is the basic unit of heredity?",
    answer: "Gene"
  },
  {
    id: 4,
    question: "Which molecule carries genetic information?",
    answer: "DNA (Deoxyribonucleic Acid)"
  }
]

export default function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % biologyFlashcards.length)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + biologyFlashcards.length) % biologyFlashcards.length)
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900">Biology Flashcards 🗂️</h1>
          <p className="text-neutral-600 mt-2">Master the fundamentals of Biology</p>
        </div>

        <div className="relative perspective-1000 h-[400px] mb-12">
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full h-full cursor-pointer transition-all duration-500 preserve-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-white border-2 border-neutral-200 rounded-[2rem] flex flex-col items-center justify-center p-12 text-center shadow-sm">
              <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Question</span>
              <h2 className="text-2xl font-semibold text-neutral-900">
                {biologyFlashcards[currentIndex].question}
              </h2>
              <p className="mt-auto text-neutral-400 text-sm italic">Click to flip</p>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden bg-neutral-100 border-2 border-neutral-200 rounded-[2rem] flex flex-col items-center justify-center p-12 text-center shadow-sm rotate-y-180">
              <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Answer</span>
              <h2 className="text-2xl font-semibold text-neutral-900">
                {biologyFlashcards[currentIndex].answer}
              </h2>
              <p className="mt-auto text-neutral-400 text-sm italic">Click to flip back</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button 
            onClick={handlePrev}
            className="p-4 bg-white border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors shadow-sm"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-neutral-500 font-medium">
              {currentIndex + 1} / {biologyFlashcards.length}
            </span>
            <button 
              onClick={() => { setIsFlipped(false); setCurrentIndex(0); }}
              className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          <button 
            onClick={handleNext}
            className="p-4 bg-white border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors shadow-sm"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </PageWrapper>
  )
}

