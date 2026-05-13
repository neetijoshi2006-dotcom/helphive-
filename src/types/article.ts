import { Timestamp } from 'firebase/firestore'

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  category: string
  tags: string[]
  authorId: string
  authorName: string
  published: boolean
  views: number
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}
