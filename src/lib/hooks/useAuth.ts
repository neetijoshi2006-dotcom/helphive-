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
    // Bypass login logic: immediately set a mock user
    setUser({
      uid: 'mock-user-123',
      email: 'admin@helphive.com',
      displayName: 'Demo User',
      role: 'admin',
      workspaceId: 'default',
      createdAt: new Date(),
      lastSeen: new Date(),
    } as User)
    setLoading(false)

    /*
    const unsubscribe = onAuth(async (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
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
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
    */
  }, [setUser])

  return { user, firebaseUser, loading }
}
