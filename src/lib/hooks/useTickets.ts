'use client'

import { useEffect, useState } from 'react'
import { subscribeToTickets } from '@/lib/firebase/firestore'
import { useAppStore } from '@/lib/store/useAppStore'
import type { Ticket } from '@/types/ticket'

export function useTickets() {
  const { user } = useAppStore()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.workspaceId) {
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToTickets(user.workspaceId, (data) => {
      setTickets(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user?.workspaceId])

  return { tickets, loading }
}
