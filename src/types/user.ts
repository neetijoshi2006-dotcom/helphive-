import { Timestamp } from 'firebase/firestore'

export type UserRole = 'admin' | 'agent' | 'viewer'

export interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: UserRole
  workspaceId: string
  createdAt: Timestamp | Date
  lastSeen: Timestamp | Date
}
