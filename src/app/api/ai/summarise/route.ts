import { NextRequest, NextResponse } from 'next/server'
import { generateTicketSummary } from '@/lib/gemini/client'
import { updateTicket } from '@/lib/firebase/firestore'

export async function POST(req: NextRequest) {
  try {
    const { ticketId, description, comments } = await req.json()
    const summary = await generateTicketSummary(description, comments || [])
    if (ticketId) await updateTicket(ticketId, { aiSummary: summary })
    return NextResponse.json({ summary })
  } catch (err) {
    console.error('Summarise error:', err)
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
  }
}
