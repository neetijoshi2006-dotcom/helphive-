const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const MODEL_NAME = 'llama-3.1-8b-instant'

const systemInstruction = `You are HiveAI, a magical and encouraging study assistant for students on HelpHive.
You help students:
- Create structured, day-by-day study planners
- Summarize complex topics into easy-to-understand notes
- Create flashcards and quizzes
- Stay motivated with friendly advice

Be structured, engaging, and encouraging. Use cute emojis (like 🌸, ✨, 🎀, 📚) where appropriate to keep things fun.`

async function callGroqAPI(messages: {role: string, content: string}[]) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: messages,
      temperature: 0.7,
    })
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Groq API Error: ${response.status} ${response.statusText} - ${errorText}`)
  }
  
  const data = await response.json()
  return data.choices[0].message.content
}

export async function generateTicketSummary(ticketDescription: string, comments: string[]): Promise<string> {
  const prompt = `Summarise this support ticket in 2-3 sentences and suggest the most likely resolution path.\n\nTicket: ${ticketDescription}\n\nComments: ${comments.join('\n---\n')}`
  return callGroqAPI([{ role: 'user', content: prompt }])
}

export async function generateReply(ticketContext: string, tone: 'formal' | 'friendly' = 'friendly'): Promise<string> {
  const prompt = `Write a ${tone} customer support reply for this ticket context:\n\n${ticketContext}\n\nRequirements:\n- Professional and empathetic\n- Acknowledge the issue clearly\n- Provide a clear next step\n- End with a supportive closing`
  return callGroqAPI([{ role: 'user', content: prompt }])
}

export async function chatWithAI(history: { role: string; parts: string }[], userMessage: string): Promise<string> {
  const messages = [
    { role: 'system', content: systemInstruction }
  ]
  
  history.forEach(h => {
    messages.push({
      role: h.role === 'model' ? 'assistant' : 'user',
      content: h.parts
    })
  })
  
  messages.push({ role: 'user', content: userMessage })
  
  return callGroqAPI(messages)
}

export async function generateStudyPlan(syllabus: string, datesheet: string): Promise<string> {
  // Inject the real current date so the AI doesn't guess or use a wrong baseline
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'Asia/Kolkata'
  })

  const prompt = `Today's date is: ${today}

Please create a detailed, day-by-day study planner based on the syllabus and exam datesheet below.

STRICT RULES you MUST follow:
1. Start the plan from TODAY (${today}) — never from any earlier or later date.
2. End the plan EXACTLY on the last exam date listed in the datesheet — never go past it.
3. Do NOT add any study days after the final exam date. The plan must stop on or before the exam day.
4. Distribute the syllabus topics evenly and realistically across the available days.
5. Include 1-2 revision days before each exam in the schedule.
6. Format nicely in Markdown with day-by-day headings, bullet points and fun emojis 🌸✨📚.

Syllabus:
${syllabus}

Exam Datesheet:
${datesheet}`

  return callGroqAPI([{ role: 'user', content: prompt }])
}


