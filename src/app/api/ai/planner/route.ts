import { NextRequest, NextResponse } from 'next/server'
import { geminiModel } from '@/lib/gemini/client'

export async function POST(req: NextRequest) {
  try {
    const { syllabus, datesheet } = await req.json()
    
    if (!syllabus || !datesheet) {
      return NextResponse.json({ error: 'Syllabus and Datesheet are required.' }, { status: 400 })
    }

    const prompt = `Please create a detailed, day-by-day study planner based on this syllabus and exam datesheet.
Break down the syllabus into manageable daily tasks leading up to the exams. Make sure there is time for revision before each exam date.
Format the output nicely using Markdown, bullet points, and use fun emojis!

Syllabus:
${syllabus}

Datesheet:
${datesheet}`

    const result = await geminiModel.generateContent(prompt)
    return NextResponse.json({ plan: result.response.text() })
  } catch (error) {
    console.error('Planner Generation Error:', error)
    return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 })
  }
}
