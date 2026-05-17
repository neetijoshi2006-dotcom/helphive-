import { NextRequest, NextResponse } from 'next/server'
import { generateStudyPlan } from '@/lib/gemini/client'

export async function POST(req: NextRequest) {
  try {
    const { syllabus, datesheet } = await req.json()
    
    if (!syllabus || !datesheet) {
      return NextResponse.json({ error: 'Syllabus and Datesheet are required.' }, { status: 400 })
    }

    const plan = await generateStudyPlan(syllabus, datesheet)
    return NextResponse.json({ plan })
  } catch (error) {
    console.error('Planner Generation Error:', error)
    return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 })
  }
}
