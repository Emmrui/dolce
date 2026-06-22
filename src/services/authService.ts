import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

export type UserMode = 'buyer' | 'seller'

export interface DolceUser {
  uid: string
  email: string
  displayName: string
  phone: string
  city: string
  mode: UserMode          // current active mode
  rating: number
  totalSales: number
  totalPurchases: number
  createdAt: any
}

export async function signUp(
  email: string,
  password: string,
  displayName: string,
  phone: string,
  city: string
): Promise<void> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(user, { displayName })

  const userData: DolceUser = {
    uid: user.uid,
    email,
    displayName,
    phone,
    city,
    mode: 'buyer',
    rating: 0,
    totalSales: 0,
    totalPurchases: 0,
    createdAt: serverTimestamp(),
  }

  await setDoc(doc(db, 'users', user.uid), userData)
}

export async function logIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function logOut(): Promise<void> {
  await signOut(auth)
}

export async function getUser(uid: string): Promise<DolceUser | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as DolceUser) : null
}

export async function setMode(uid: string, mode: UserMode): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { mode })
}
