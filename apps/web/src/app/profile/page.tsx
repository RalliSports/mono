'use client'

import { Suspense } from 'react'
import { ProfileContent } from './components'
import { useWalletConnection } from '../main/hooks/useWalletConnection'

export default function ProfilePageNew() {
  const { mounted } = useWalletConnection()
  if (!mounted) {
    return null
  }
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-700 rounded"></div>
                <div className="h-64 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  )
}
