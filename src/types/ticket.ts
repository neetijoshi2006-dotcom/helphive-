import { Timestamp } from 'firebase/firestore'

export type TicketStatus = 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed'
export type TicketPriority = 'critical' | 'high' | 'medium' | 'low'

export interface Comment {
  id: string
  authorId: string
  authorName: string
  body: string
  isInternal: boolean
  createdAt: Timestamp | Date
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: string
  tags: string[]
  createdBy: string
  createdByName: string
  assignedTo?: string
  assignedToName?: string
  workspaceId: string
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
  resolvedAt?: Timestamp | Date
  aiSummary?: string
  comments: Comment[]
}

export interface TicketFilter {
  status?: TicketStatus | 'all'
  priority?: TicketPriority | 'all'
  assignedTo?: string
  search?: string
}
