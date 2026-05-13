'use client'

import { useState } from 'react'
import type { AnalyticsOverview, DailyMetric, AgentPerformance } from '@/types/analytics'

// Demo analytics data for rendering charts and stats
function generateDemoMetrics(): DailyMetric[] {
  const metrics: DailyMetric[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    metrics.push({
      date: d.toISOString().split('T')[0],
      ticketCount: Math.floor(Math.random() * 30) + 10,
      resolvedCount: Math.floor(Math.random() * 25) + 5,
      avgResponseTime: Math.floor(Math.random() * 120) + 15,
    })
  }
  return metrics
}

const demoAgents: AgentPerformance[] = [
  { uid: '1', displayName: 'Sarah Chen', ticketsResolved: 142, avgHandleTime: 24, csat: 4.8 },
  { uid: '2', displayName: 'Alex Rivera', ticketsResolved: 128, avgHandleTime: 31, csat: 4.6 },
  { uid: '3', displayName: 'Jordan Lee', ticketsResolved: 115, avgHandleTime: 28, csat: 4.7 },
  { uid: '4', displayName: 'Morgan Blake', ticketsResolved: 98, avgHandleTime: 35, csat: 4.5 },
  { uid: '5', displayName: 'Casey Kim', ticketsResolved: 87, avgHandleTime: 22, csat: 4.9 },
]

const demoCategories = [
  { category: 'Billing', count: 89 },
  { category: 'Technical', count: 134 },
  { category: 'Account', count: 56 },
  { category: 'Feature Request', count: 42 },
  { category: 'General', count: 31 },
]

export function useAnalytics(): { data: AnalyticsOverview; loading: boolean } {
  const [loading] = useState(false)

  const data: AnalyticsOverview = {
    totalTickets: 352,
    avgResolutionTime: 28,
    csatScore: 4.7,
    firstResponseTime: 12,
    dailyMetrics: generateDemoMetrics(),
    agentPerformance: demoAgents,
    ticketsByCategory: demoCategories,
  }

  return { data, loading }
}
