import { initializeApp, getApps, getApp } from 'firebase/app'
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyB2HSFiRzvnm6J7ECcC-0DILHaVzwQw8II",
  authDomain: "dolce-25919.firebaseapp.com",
  projectId: "dolce-25919",
  storageBucket: "dolce-25919.firebasestorage.app",
  messagingSenderId: "1017208166059",
  appId: "1:1017208166059:web:6193576846a1b33f1389ee",
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

let auth: any
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  })
} catch {
  auth = getAuth(app)
}

export { auth }
export const db = getFirestore(app)
export const storage = getStorage(app)