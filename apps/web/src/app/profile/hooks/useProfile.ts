import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/toast'
import { useAccount } from '@getpara/react-sdk'
import { useSearchParams } from 'next/navigation'
import { GamesServiceGetMyOpenGames, UserServiceFindOne, GamesServiceGetMyCompletedGames } from '@repo/server'
export function useProfile(session: string | null) {
  const account = useAccount()
  const { addToast } = useToast()
  const [username, setUsername] = useState('')
  const [user, setUser] = useState<UserServiceFindOne | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  const [gamesLoading, setGamesLoading] = useState(true)
  const [avatar, setAvatar] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [myOpenGames, setMyOpenGames] = useState<GamesServiceGetMyOpenGames>([])
  const [myCompletedGames, setMyCompletedGames] = useState<GamesServiceGetMyCompletedGames>([])

  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') ?? ''

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
        setUserLoading(true)
        if (userId) {
          response = await fetch(`/api/user/${userId}`)
        } else {
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
        console.log(err, 'error fetching user')
        addToast('Unexpected error fetching user', 'error')
      } finally {
        setUserLoading(false)
      }
    }
    if (session || userId) {
      fetchUser()
    }
  }, [session, userId])

  useEffect(() => {
    const fetchMyOpenGames = async () => {
      try {
        setGamesLoading(true)
        const response = await fetch(`/api/read-my-open-games?userId=${user?.id}`)
        if (response.ok) {
          const data = await response.json()
          setMyOpenGames(data)
        } else {
          const errorData = await response.json()
          console.error(errorData)
          // addToast(errorData.error || 'Failed to fetch my open games', 'error')
        }
      } catch (error) {
        setGamesLoading(false)
      } finally {
        setGamesLoading(false)
      }
    }
    if (user?.id !== undefined) {
      fetchMyOpenGames()
    }
  }, [session, user])

  useEffect(() => {
    const fetchMyCompletedGames = async () => {
      try {
        setGamesLoading(true)
        const response = await fetch(`/api/read-my-completed-games?userId=${user?.id}`)
        if (response.ok) {
          const data = await response.json()
          setMyCompletedGames(data)
        } else {
          const errorData = await response.json()
          // addToast(errorData.error || 'Failed to fetch my completed games', 'error')
        }
      } catch (error) {
        setGamesLoading(false)
      } finally {
        setGamesLoading(false)
      }
    }
    if (user?.id !== undefined) {
      fetchMyCompletedGames()
    }
  }, [session, user])

  return {
    username,
    setUsername,
    user,
    userLoading,
    gamesLoading,
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
  }
}
