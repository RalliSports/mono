'use client'

import { Suspense } from 'react'
import { ProfileContent, ProfileContentSkeleton } from './components'
import { useWalletConnection } from '../main/hooks/useWalletConnection'

export default function ProfilePageNew() {
  const { mounted } = useWalletConnection()
  if (!mounted) {
    return null
  }
  return (
    <Suspense fallback={<ProfileContentSkeleton />}>
      <ProfileContent />
    </Suspense>
  )
}
