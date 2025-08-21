import { useState, useEffect } from 'react'
import { useSessionToken } from '@/hooks/use-session'
import type { User } from '../components/types'

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const { session } = useSessionToken()

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/read-current-user', {
        headers: {
          'x-para-session': session || '',
        },
      })
      const data = await response.json()
      setUser(data)
    }
    if (session) {
      fetchUser()
    }
  }, [session])

  return { user }
}
