import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './firebase'

export type Category = 'dresses' | 'jeans' | 'bags' | 'shoes' | 'jackets' | 'tops' | 'other'
export type Condition = 'like_new' | 'good' | 'fair'
export type DeliveryOption = 'courier' | 'pickup_point' | 'self_pickup'
export type ListingStatus = 'active' | 'sold' | 'reserved'

export interface Listing {
  id?: string
  sellerId: string
  sellerName: string
  sellerCity: string
  title: string
  description: string
  price: number
  category: Category
  size: string
  condition: Condition
  delivery: DeliveryOption[]
  images: string[]        // download URLs
  status: ListingStatus
  createdAt: any
}

// Upload a local image URI to Firebase Storage, return download URL
export async function uploadImage(uri: string, listingId: string, index: number): Promise<string> {
  const response = await fetch(uri)
  const blob = await response.blob()
  const storageRef = ref(storage, `listings/${listingId}/photo_${index}`)
  await uploadBytes(storageRef, blob)
  return getDownloadURL(storageRef)
}

export async function createListing(
  data: Omit<Listing, 'id' | 'images' | 'status' | 'createdAt'>,
  localImageUris: string[]
): Promise<string> {
  // Create doc first to get the ID for storage paths
  const docRef = await addDoc(collection(db, 'listings'), {
    ...data,
    images: [],
    status: 'active',
    createdAt: serverTimestamp(),
  })

  // Upload images
  const urls = await Promise.all(
    localImageUris.map((uri, i) => uploadImage(uri, docRef.id, i))
  )

  await updateDoc(docRef, { images: urls })
  return docRef.id
}

export async function fetchListings(category?: Category): Promise<Listing[]> {
  let q = query(
    collection(db, 'listings'),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc')
  )

  if (category) {
    q = query(
      collection(db, 'listings'),
      where('status', '==', 'active'),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    )
  }

  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Listing))
}

export async function fetchMyListings(sellerId: string): Promise<Listing[]> {
  const q = query(
    collection(db, 'listings'),
    where('sellerId', '==', sellerId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Listing))
}

export async function getListing(id: string): Promise<Listing | null> {
  const snap = await getDoc(doc(db, 'listings', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } as Listing : null
}

export async function markSold(listingId: string): Promise<void> {
  await updateDoc(doc(db, 'listings', listingId), { status: 'sold' })
}
