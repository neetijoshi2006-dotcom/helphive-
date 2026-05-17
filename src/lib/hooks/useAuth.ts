'use client'

import { useEffect, useState } from 'react'
import { onAuth } from '@/lib/firebase/auth'
import { getUser } from '@/lib/firebase/firestore'
import { useAppStore } from '@/lib/store/useAppStore'
import type { User as FirebaseUser } from 'firebase/auth'
import type { User } from '@/types/user'

export function useAuth() {
  const { user, setUser } = useAppStore()
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuth(async (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        // Clear demo bypass since we have a real user!
        if (typeof window !== 'undefined') {
          localStorage.removeItem('helphive_demo_user')
        }
        try {
          const dbUser = await getUser(fbUser.uid)
          if (dbUser) {
            setUser(dbUser)
          } else {
            // Create a fallback user object
            setUser({
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || 'User',
              role: 'agent',
              workspaceId: 'default',
              createdAt: new Date(),
              lastSeen: new Date(),
            } as User)
          }
        } catch {
          setUser({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || 'User',
            role: 'agent',
            workspaceId: 'default',
            createdAt: new Date(),
            lastSeen: new Date(),
          } as User)
        }
      } else {
        // No real user, check if we have a guest demo session active
        const isDemo = typeof window !== 'undefined' && localStorage.getItem('helphive_demo_user') === 'true'
        if (isDemo) {
          setUser({
            uid: 'demo-user-123',
            email: 'demo@helphive.com',
            displayName: 'Demo Bee 🐝',
            role: 'admin',
            workspaceId: 'default',
            createdAt: new Date(),
            lastSeen: new Date(),
          } as User)
        } else {
          setUser(null)
        }
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [setUser])

  return { user, firebaseUser, loading }
}
