import { NextRequest, NextResponse } from 'next/server'
import { chatWithAI } from '@/lib/gemini/client'

export async function POST(req: NextRequest) {
  try {
    const { history, message } = await req.json()
    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 })
    const reply = await chatWithAI(history || [], message)
    return NextResponse.json({ reply })
  } catch (error) {
    console.error('AI chat error:', error)
    
    // Provide a graceful fallback response if the Gemini API fails due to billing/API key issues
    return NextResponse.json({ 
      reply: "🐝 **HiveAI (Offline Mode):** It looks like my connection to the Google Gemini servers is currently blocked (likely due to an invalid or unlinked API Key/Billing Account). Until the real API key is fixed, I'm just a friendly placeholder! But your UI is working perfectly! 🎉" 
    })
  }
}
