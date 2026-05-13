'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { Ticket } from '@/types/ticket'

export function useRealtimeTickets(workspaceId: string | undefined, maxResults = 50) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!workspaceId) {
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'tickets'),
      where('workspaceId', '==', workspaceId),
      orderBy('updatedAt', 'desc'),
      limit(maxResults)
    )

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Ticket))
      setTickets(data)
      setLoading(false)
    }, () => {
      setLoading(false)
    })

    return () => unsubscribe()
  }, [workspaceId, maxResults])

  return { tickets, loading }
}

export function useRealtimeCount(collectionName: string, field: string, value: string) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!value) return
    const q = query(
      collection(db, collectionName),
      where(field, '==', value)
    )
    const unsub = onSnapshot(q, (snap) => {
      setCount(snap.size)
    })
    return () => unsub()
  }, [collectionName, field, value])

  return count
}
