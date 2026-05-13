import { NextRequest, NextResponse } from 'next/server'
import { chatWithAI } from '@/lib/gemini/client'

export async function POST(req: NextRequest) {
  try {
    const { history, message } = await req.json()
    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 })
    const reply = await chatWithAI(history || [], message)
    return NextResponse.json({ reply })
  } catch (err) {
    console.error('AI chat error:', err)
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 })
  }
}
