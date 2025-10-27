'use client'

import { Suspense } from 'react'
import { useWalletConnection } from '../main/hooks/useWalletConnection'
import { ProfileContent } from './components'

export default function ProfilePageNew() {
  const { mounted } = useWalletConnection()
  if (!mounted) {
    return null
  }
  return <ProfileContent />
}
