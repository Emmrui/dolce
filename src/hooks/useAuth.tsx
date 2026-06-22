import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth, db } from '../services/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { DolceUser, UserMode, setMode } from '../services/authService'

interface AuthContextType {
  firebaseUser: User | null
  dolceUser: DolceUser | null
  loading: boolean
  switchMode: (mode: UserMode) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  dolceUser: null,
  loading: true,
  switchMode: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [dolceUser, setDolceUser] = useState<DolceUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setFirebaseUser(user)
      if (!user) {
        setDolceUser(null)
        setLoading(false)
      }
    })
    return unsub
  }, [])

  // Real-time listener on the Firestore user doc
  useEffect(() => {
    if (!firebaseUser) return
    const unsub = onSnapshot(doc(db, 'users', firebaseUser.uid), snap => {
      setDolceUser(snap.exists() ? (snap.data() as DolceUser) : null)
      setLoading(false)
    })
    return unsub
  }, [firebaseUser])

  const switchMode = async (mode: UserMode) => {
    if (!firebaseUser) return
    await setMode(firebaseUser.uid, mode)
    // dolceUser updates automatically via the snapshot listener
  }

  return (
    <AuthContext.Provider value={{ firebaseUser, dolceUser, loading, switchMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
