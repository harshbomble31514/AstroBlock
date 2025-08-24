'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { isFirebaseConfigured } from '@/lib/storage'

interface FirebaseContextType {
  user: any | null
  loading: boolean
  isConfigured: boolean
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  isConfigured: false,
})

export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error('useFirebase must be used within FirebaseProvider')
  }
  return context
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For demo mode without Firebase
    if (!isFirebaseConfigured) {
      setUser(null)
      setLoading(false)
      return
    }

    // If Firebase was configured, we would set up auth state listener here
    // For now, just mark as not loading
    setLoading(false)
  }, [])

  const value = {
    user,
    loading,
    isConfigured: isFirebaseConfigured,
  }

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  )
}
