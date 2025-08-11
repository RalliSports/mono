'use client'
import { useClient } from '@getpara/react-sdk'

export function useSessionToken() {
  const para = useClient()
  const session = para?.exportSession()
  // console.log(session, 'para session')

  return { session }
}
