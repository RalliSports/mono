import { useState, useEffect } from 'react'
import { User, Game } from '../components/types'
import { useToast } from '@/components/ui/toast'
import { useAccount } from '@getpara/react-sdk'
import { useSearchParams } from 'next/navigation'

export function useProfile(session: string | null) {
  const account = useAccount()
  const { addToast } = useToast()
  const [username, setUsername] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [avatar, setAvatar] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [myOpenGames, setMyOpenGames] = useState<Game[]>([])
  const [myCompletedGames, setMyCompletedGames] = useState<Game[]>([])
  const [forceRefresh, setForceRefresh] = useState(false)

  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') ?? ''

  console.log(user, userId, "all users")

  const handleUpdateUser = async () => {
    const response = await fetch('/api/update-user', {
      method: 'PATCH',
      headers: {
        'x-para-session': session || '',
      },
      body: JSON.stringify({
        username,
        avatar: avatar || '/images/pfp-1.svg',
        firstName,
        lastName,
      }),
    })
    const data = await response.json()
    setUser(data)
    setUsername(data.username)
    setAvatar(data.avatar)
    setFirstName(data.firstName || '')
    setLastName(data.lastName || '')
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let response

        if (userId) {
          response = await fetch(`/api/user/${userId}`)
          

        } else  {
          response = await fetch('/api/read-current-user', {
            headers: { 'x-para-session': session ?? '' },
          })
             
        }

        if (response?.ok) {
          const data = await response.json()
          setUser(data)
          setUsername(data.username)
          setAvatar(data.avatar)
          setFirstName(data.firstName || '')
          setLastName(data.lastName || '')

          if (!data.emailAddress && account.embedded.isConnected) {
            await fetch('/api/update-user-email', {
              method: 'PATCH',
              headers: {
                'x-para-session': session || '',
              },
              body: JSON.stringify({
                email: account.embedded.email,
              }),
            })
          }
        } else {
          const errorData = await response?.json()
          addToast(errorData.error || 'Failed to fetch user', 'error')
        }
      } catch (err) {
        console.log(err, "error fetching user")
        addToast('Unexpected error fetching user', 'error')
      }
    }
    if (session || userId) {
      fetchUser()
    }
  }, [session, userId])

  useEffect(() => {
    const fetchMyOpenGames = async () => {
      const response = await fetch(`/api/read-my-open-games?userId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setMyOpenGames(data)
      } else {
        const errorData = await response.json()
        // addToast(errorData.error || 'Failed to fetch my open games', 'error')
      }
    }
      fetchMyOpenGames()
    
  }, [ session, user])

  useEffect(() => {
    const fetchMyCompletedGames = async () => {
      const response = await fetch(`/api/read-my-completed-games?userId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setMyCompletedGames(data)
      } else {
        const errorData = await response.json()
        // addToast(errorData.error || 'Failed to fetch my completed games', 'error')
      }
    }
    fetchMyCompletedGames()
  }, [session, user])

  return {
    username,
    setUsername,
    user,
    setUser,
    avatar,
    setAvatar,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    myOpenGames,
    myCompletedGames,
    handleUpdateUser,
    setForceRefresh,
  }
}
