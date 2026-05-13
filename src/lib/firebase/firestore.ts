import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, where, orderBy, limit,
  onSnapshot, serverTimestamp,
  type QueryConstraint, type DocumentData, type FirestoreDataConverter
} from 'firebase/firestore'
import { db } from './config'
import type { Ticket } from '@/types/ticket'
import type { User } from '@/types/user'
import type { Article } from '@/types/article'

// Generic typed converter
function converter<T>(): FirestoreDataConverter<T> {
  return {
    toFirestore: (data: T) => data as DocumentData,
    fromFirestore: (snap) => ({ id: snap.id, ...snap.data() } as T),
  }
}

// --- Tickets ---
export const ticketsCol = collection(db, 'tickets').withConverter(converter<Ticket>())

export async function getTickets(workspaceId: string, constraints: QueryConstraint[] = []) {
  const q = query(ticketsCol,
    where('workspaceId', '==', workspaceId),
    orderBy('createdAt', 'desc'),
    ...constraints
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data())
}

export function subscribeToTickets(workspaceId: string, cb: (tickets: Ticket[]) => void) {
  const q = query(ticketsCol,
    where('workspaceId', '==', workspaceId),
    orderBy('updatedAt', 'desc'),
    limit(50)
  )
  return onSnapshot(q, snap => cb(snap.docs.map(d => d.data())))
}

export async function createTicket(data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) {
  return addDoc(ticketsCol, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as Ticket)
}

export async function updateTicket(id: string, data: Partial<Ticket>) {
  return updateDoc(doc(db, 'tickets', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteTicket(id: string) {
  return deleteDoc(doc(db, 'tickets', id))
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  const snap = await getDoc(doc(db, 'tickets', id).withConverter(converter<Ticket>()))
  return snap.exists() ? snap.data() : null
}

// --- Users ---
export const usersCol = collection(db, 'users').withConverter(converter<User>())

export async function getUser(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', uid).withConverter(converter<User>()))
  return snap.exists() ? snap.data() : null
}

export async function upsertUser(uid: string, data: Partial<User>) {
  return updateDoc(doc(db, 'users', uid), { ...data, lastSeen: serverTimestamp() })
}

export async function getTeamMembers(workspaceId: string): Promise<User[]> {
  const q = query(usersCol, where('workspaceId', '==', workspaceId))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data())
}

// --- Articles ---
export const articlesCol = collection(db, 'articles').withConverter(converter<Article>())

export async function getPublishedArticles() {
  const q = query(articlesCol, where('published', '==', true), orderBy('updatedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data())
}

export async function getAllArticles() {
  const q = query(articlesCol, orderBy('updatedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data())
}

export async function createArticle(data: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) {
  return addDoc(articlesCol, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as Article)
}

export async function updateArticle(id: string, data: Partial<Article>) {
  return updateDoc(doc(db, 'articles', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}
