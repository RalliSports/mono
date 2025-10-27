import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserServiceFindOne } from '@repo/server'

export function useUserData(session: string | undefined) {
  const router = useRouter()
  const [user, setUser] = useState<UserServiceFindOne | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!session) return

      try {
        const response = await fetch('/api/read-current-user', {
          headers: {
            'x-para-session': session,
          },
        })
        const data: UserServiceFindOne | null = await response.json()
        if (data && !data.username) {
          router.push('/profile')
        }
        setUser(data)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    if (session) {
      fetchUser()
    }
  }, [session, router])

  return { user, setUser }
}
