'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Send, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: Date
}

const suggestions = [
  'Summarise open tickets this week ✨',
  'Draft a refund reply for a billing issue 🎀',
  'What are the most common issues today? 📊',
  'Write a knowledge base article 🌸',
]

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: 'Hello! I\'m HiveAI ✨ I can help you draft replies, summarise tickets, identify patterns, and write articles. How can I help you make magic happen today?', time: new Date() },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim(), time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages
        .filter(m => m.id !== '0')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: m.content
        }))
        
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, message: text.trim() })
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'AI service unavailable')
      
      const aiMsg: Message = { id: (Date.now()+1).toString(), role: 'assistant', content: data.reply, time: new Date() }
      setMessages(prev => [...prev, aiMsg])
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect to AI 🥺')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied to clipboard! 🎀')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <PageWrapper className="h-full flex flex-col -m-6">
      <div className="flex-1 flex flex-col bg-neutral-50 rounded-none overflow-hidden">
        {/* Header */}
        <div className="px-4 md:px-6 py-3.5 md:py-4 border-b border-primary-100 flex items-center gap-3 bg-neutral-100/50 backdrop-blur-md shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-300 to-primary flex items-center justify-center shadow-sm">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h1 className="text-neutral-900 font-semibold text-sm md:text-base">HiveAI Assistant</h1>
            <p className="text-primary text-[10px] md:text-xs font-medium">Powered by Magic 🪄</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
          {messages.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center shrink-0 mr-2 md:mr-3 mt-1">
                  <span className="text-sm">✨</span>
                </div>
              )}
              <div className={`max-w-[85%] md:max-w-[75%] rounded-[24px] px-4 md:px-5 py-3 md:py-4 text-xs md:text-sm leading-relaxed shadow-sm ${
                m.role === 'user' ? 'bg-gradient-to-r from-primary to-primary-400 text-neutral-900 rounded-tr-sm' : 'bg-neutral-100 text-neutral-800 border border-primary-100 rounded-tl-sm'
              }`}>
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-200/20">
                  <span className={`text-[10px] font-medium ${m.role === 'user' ? 'text-neutral-900/70' : 'text-neutral-400'}`}>{m.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {m.role === 'assistant' && (
                    <button onClick={() => copyToClipboard(m.id, m.content)} className="text-primary hover:text-primary-400 transition-colors cursor-pointer p-1 hover:bg-primary-50 rounded-lg">
                      {copiedId === m.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start items-end">
              <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center shrink-0 mr-2 md:mr-3 mb-1">
                <span className="text-sm">✨</span>
              </div>
              <div className="bg-neutral-100 rounded-[24px] rounded-tl-sm px-4 md:px-5 py-3 md:py-4 shadow-sm border border-primary-100">
                <div className="flex gap-1.5 py-1">
                  <span className="w-2 h-2 bg-primary-300 rounded-full animate-bounce" style={{animationDelay:'0ms'}}/>
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/>
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/>
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-4 md:px-6 pb-3 flex gap-2 flex-wrap">
            {suggestions.map(s => (
              <button key={s} onClick={() => sendMessage(s.replace(/ [^\w\s]+$/, ''))}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-primary-200 bg-neutral-100 text-[10px] md:text-xs font-medium text-neutral-600 hover:text-primary hover:border-primary hover:bg-primary-50 transition-all cursor-pointer shadow-sm hover:-translate-y-0.5">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 md:px-6 py-4 md:py-5 border-t border-primary-100 bg-neutral-100/50 backdrop-blur-md shrink-0">
          <form onSubmit={e => { e.preventDefault(); sendMessage(input) }} className="flex gap-2 md:gap-3">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask HiveAI for some magic... ✨"
              className="flex-1 px-4 md:px-5 py-2.5 md:py-3 rounded-full bg-neutral-100 border-2 border-primary-100 text-[16px] md:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(255,107,139,0.15)] transition-all" />
            <Button type="submit" disabled={!input.trim() || loading} size="md" className="rounded-full px-5 md:px-6 bg-gradient-to-r from-primary to-primary-400 shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}
