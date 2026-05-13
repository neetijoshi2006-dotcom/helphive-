import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  systemInstruction: `You are HiveAI, a magical and encouraging study assistant for students on HelpHive.
You help students:
- Create structured, day-by-day study planners
- Summarize complex topics into easy-to-understand notes
- Create flashcards and quizzes
- Stay motivated with friendly advice

Be structured, engaging, and encouraging. Use cute emojis (like 🌸, ✨, 🎀, 📚) where appropriate to keep things fun.`,
})

export async function generateTicketSummary(ticketDescription: string, comments: string[]): Promise<string> {
  const prompt = `Summarise this support ticket in 2-3 sentences and suggest the most likely resolution path.

Ticket: ${ticketDescription}

Comments: ${comments.join('\n---\n')}`

  const result = await geminiModel.generateContent(prompt)
  return result.response.text()
}

export async function generateReply(ticketContext: string, tone: 'formal' | 'friendly' = 'friendly'): Promise<string> {
  const prompt = `Write a ${tone} customer support reply for this ticket context:

${ticketContext}

Requirements:
- Professional and empathetic
- Acknowledge the issue clearly
- Provide a clear next step
- End with a supportive closing`

  const result = await geminiModel.generateContent(prompt)
  return result.response.text()
}

export async function chatWithAI(history: { role: string; parts: string }[], userMessage: string): Promise<string> {
  const chat = geminiModel.startChat({
    history: history.map(h => ({
      role: h.role as 'user' | 'model',
      parts: [{ text: h.parts }],
    })),
  })
  const result = await chat.sendMessage(userMessage)
  return result.response.text()
}
