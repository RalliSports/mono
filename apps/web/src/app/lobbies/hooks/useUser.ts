import { useState, useEffect } from 'react'
import { useSessionToken } from '@/hooks/use-session'
import type { User } from '../components/types'
import { useToast } from '@/components/ui/toast'

export const useUser = () => {
  const { addToast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const { session } = useSessionToken()

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/read-current-user', {
        headers: {
          'x-para-session': session || '',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        const errorData = await response.json()
        addToast(errorData.error || 'Failed to fetch current user', 'error')
      }
    }
    if (session) {
      fetchUser()
    }
  }, [session])

  return { user }
}
