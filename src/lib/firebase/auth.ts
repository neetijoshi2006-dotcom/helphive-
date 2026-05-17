import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config'

export async function signIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  // Set session cookie for middleware
  document.cookie = `session=${await cred.user.getIdToken()};path=/;max-age=${60 * 60 * 24 * 7}`
  return cred.user
}

export async function signUp(email: string, password: string, displayName: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName })

  // Create user document in Firestore - caught gracefully so lack of database config doesn't block signup
  try {
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName,
      role: 'agent',
      workspaceId: 'default',
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
    })
  } catch (firestoreError) {
    console.warn('Firestore registration write bypassed or failed:', firestoreError)
  }

  document.cookie = `session=${await cred.user.getIdToken()};path=/;max-age=${60 * 60 * 24 * 7}`
  return cred.user
}

export async function signOut() {
  await firebaseSignOut(auth)
  document.cookie = 'session=;path=/;max-age=0'
}

export function onAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback)
}
