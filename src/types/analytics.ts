export interface DailyMetric {
  date: string
  ticketCount: number
  resolvedCount: number
  avgResponseTime: number
}

export interface AgentPerformance {
  uid: string
  displayName: string
  photoURL?: string
  ticketsResolved: number
  avgHandleTime: number
  csat: number
}

export interface AnalyticsOverview {
  totalTickets: number
  avgResolutionTime: number
  csatScore: number
  firstResponseTime: number
  dailyMetrics: DailyMetric[]
  agentPerformance: AgentPerformance[]
  ticketsByCategory: { category: string; count: number }[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
  relatedTicketId?: string
}
