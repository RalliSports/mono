import { useState, useEffect } from 'react'
import { useSessionToken } from '@/hooks/use-session'
import { useToast } from '@/components/ui/toast'
import { UserServiceFindOne } from '@repo/server'

export const useUser = () => {
  const { addToast } = useToast()
  const [user, setUser] = useState<UserServiceFindOne | null>(null)
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
