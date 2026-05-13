'use client'

import { useState } from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { CheckCircle2, XCircle, Trophy, ArrowRight, RefreshCcw } from 'lucide-react'

const quizQuestions = [
  {
    id: 1,
    question: "Which of the following is NOT a fundamental force of nature?",
    options: ["Gravity", "Electromagnetism", "Centrifugal Force", "Strong Nuclear Force"],
    correct: 2
  },
  {
    id: 2,
    question: "What is the chemical symbol for Gold?",
    options: ["Ag", "Au", "Pb", "Fe"],
    correct: 1
  },
  {
    id: 3,
    question: "Who developed the theory of general relativity?",
    options: ["Isaac Newton", "Nikola Tesla", "Albert Einstein", "Marie Curie"],
    correct: 2
  }
]

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const handleSubmit = () => {
    if (selectedOption === null) return
    
    if (selectedOption === quizQuestions[currentStep].correct) {
      setScore(prev => prev + 1)
    }
    setIsSubmitted(true)
  }

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(prev => prev + 1)
      setSelectedOption(null)
      setIsSubmitted(false)
    } else {
      setIsFinished(true)
    }
  }

  const resetQuiz = () => {
    setCurrentStep(0)
    setSelectedOption(null)
    setIsSubmitted(false)
    setScore(0)
    setIsFinished(false)
  }

  if (isFinished) {
    return (
      <PageWrapper>
        <div className="max-w-xl mx-auto text-center py-20 bg-white border border-neutral-200 rounded-[3rem] p-12 shadow-sm mt-10">
          <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={40} />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Quiz Completed!</h2>
          <p className="text-neutral-600 mb-8">You scored {score} out of {quizQuestions.length}</p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={resetQuiz}
              className="w-full bg-neutral-800 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm"
            >
              <RefreshCcw size={20} />
              Try Again
            </button>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Question {currentStep + 1} of {quizQuestions.length}</span>
            <span className="text-sm font-bold text-neutral-900">Score: {score}</span>
          </div>
          <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-neutral-600 transition-all duration-500" 
              style={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-[2.5rem] p-10 shadow-sm">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">
            {quizQuestions[currentStep].question}
          </h2>

          <div className="space-y-4">
            {quizQuestions[currentStep].options.map((option, index) => {
              const isCorrect = index === quizQuestions[currentStep].correct
              const isSelected = index === selectedOption
              
              let variantClasses = "border-neutral-200 hover:border-neutral-400"
              if (isSubmitted) {
                if (isCorrect) variantClasses = "border-green-500 bg-green-50"
                else if (isSelected) variantClasses = "border-red-500 bg-red-50"
                else variantClasses = "border-neutral-100 opacity-50"
              } else if (isSelected) {
                variantClasses = "border-neutral-800 bg-neutral-50"
              }

              return (
                <button
                  key={index}
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(index)}
                  className={`w-full flex items-center justify-between p-5 border-2 rounded-2xl transition-all text-left group ${variantClasses}`}
                >
                  <span className="font-medium text-neutral-800">{option}</span>
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
                className="w-full bg-neutral-800 text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full bg-neutral-800 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all animate-fade-in shadow-sm"
              >
                {currentStep < quizQuestions.length - 1 ? "Next Question" : "View Results"}
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

