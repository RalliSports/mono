import React, { Suspense } from 'react'
import ProfilePageNew from './client'
import { ProfileContentSkeleton } from './components'

export default function page() {
  return (
    <Suspense fallback={<ProfileContentSkeleton />}>
      <ProfilePageNew />
    </Suspense>
  )
}
