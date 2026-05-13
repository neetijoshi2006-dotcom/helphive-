'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Send, Copy, Sparkles, Check } from 'lucide-react'
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

    setTimeout(() => {
      const responses: Record<string, string> = {
        'summarise': 'Here is your weekly ticket summary 📊:\n\n- Total tickets: 34 open, 12 pending, 28 resolved\n- Top category: Billing (12 tickets, up 15% from last week)\n- Critical issues: 3 (SSO integration, payment gateway, data export)\n- Average resolution time: 4.2 hours\n- CSAT score: 4.7/5.0\n\nKey trends:\n- Authentication-related tickets increased by 30%\n- First response time improved to 12 minutes (down from 18)\n- Agent Casey Kim has the highest CSAT at 4.9',
        'draft': 'Here is a draft refund reply 🎀:\n\n---\n\nSubject: Your Refund Request - [Ticket ID]\n\nDear [Customer Name],\n\nThank you for reaching out regarding the billing discrepancy on your account. I have reviewed your case and can confirm that an overcharge occurred during the last billing cycle.\n\nI have processed a full refund of [amount] to your original payment method. Please allow 5-7 business days for the refund to appear on your statement.\n\nTo prevent this from happening in the future, I have also flagged your account for a manual review during the next billing cycle.\n\nPlease do not hesitate to reach out if you have any further questions or concerns.\n\nBest regards,\n[Agent Name]\nHelpHive Support Team',
        'common': 'Based on today\'s ticket data, here are the most common issues 🌸:\n\n1. Password Reset Failures (8 tickets)\n   - Primarily on mobile iOS devices\n   - Related to v3.2.1 update\n   - Fix in progress for v3.2.2\n\n2. Billing Discrepancies (5 tickets)\n   - Pro plan upgrade proration errors\n   - Automated refund process recommended\n\n3. API Rate Limiting (4 tickets)\n   - Enterprise customers hitting new limits\n   - Consider adjusting tier thresholds\n\n4. SSO Integration (3 tickets)\n   - SAML configuration issues\n   - Documentation update needed',
        'default': 'I\'ve analyzed the available data and here are my findings ✨:\n\n- Your support queue is performing beautifully!\n- Resolution times are trending downward.\n- Customer satisfaction remains high at 4.7/5.0.\n- I recommend prioritizing the 3 critical tickets first.\n\nWould you like me to go deeper into any specific area? I can draft replies, create summaries, or help identify patterns in your support data.',
      }
      const key = text.toLowerCase().includes('summar') ? 'summarise' : text.toLowerCase().includes('draft') || text.toLowerCase().includes('refund') ? 'draft' : text.toLowerCase().includes('common') ? 'common' : 'default'
      const aiMsg: Message = { id: (Date.now()+1).toString(), role: 'assistant', content: responses[key], time: new Date() }
      setMessages(prev => [...prev, aiMsg])
      setLoading(false)
    }, 1200)
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
        <div className="px-6 py-4 border-b border-primary-100 flex items-center gap-3 bg-neutral-100/50 backdrop-blur-md">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-300 to-primary flex items-center justify-center shadow-sm">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h1 className="text-neutral-900 font-semibold text-base">HiveAI Assistant</h1>
            <p className="text-primary text-xs font-medium">Powered by Magic 🪄</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center shrink-0 mr-3 mt-1">
                  <span className="text-sm">✨</span>
                </div>
              )}
              <div className={`max-w-[75%] rounded-[24px] px-5 py-4 text-sm leading-relaxed shadow-sm ${
                m.role === 'user' ? 'bg-gradient-to-r from-primary to-primary-400 text-neutral-900 rounded-tr-sm' : 'bg-neutral-100 text-neutral-800 border border-primary-100 rounded-tl-sm'
              }`}>
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100/20">
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
              <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center shrink-0 mr-3 mb-1">
                <span className="text-sm">✨</span>
              </div>
              <div className="bg-neutral-100 rounded-[24px] rounded-tl-sm px-5 py-4 shadow-sm border border-primary-100">
                <div className="flex gap-1.5 py-1">
                  <span className="w-2.5 h-2.5 bg-primary-300 rounded-full animate-bounce" style={{animationDelay:'0ms'}}/>
                  <span className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/>
                  <span className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/>
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-3 flex gap-2 flex-wrap">
            {suggestions.map(s => (
              <button key={s} onClick={() => sendMessage(s.replace(/ [^\w\s]+$/, ''))}
                className="px-4 py-2 rounded-full border border-primary-200 bg-neutral-100 text-xs font-medium text-neutral-600 hover:text-primary hover:border-primary hover:bg-primary-50 transition-all cursor-pointer shadow-sm hover:-translate-y-0.5">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-6 py-5 border-t border-primary-100 bg-neutral-100/50 backdrop-blur-md">
          <form onSubmit={e => { e.preventDefault(); sendMessage(input) }} className="flex gap-3">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask HiveAI for some magic... ✨"
              className="flex-1 px-5 py-3 rounded-full bg-neutral-100 border-2 border-primary-100 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(255,107,139,0.15)] transition-all" />
            <Button type="submit" disabled={!input.trim() || loading} size="md" className="rounded-full px-6 bg-gradient-to-r from-primary to-primary-400">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}
