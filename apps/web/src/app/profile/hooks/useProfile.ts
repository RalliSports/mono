import { useState, useEffect } from 'react'
import { User, Game } from '../components/types'
import { useToast } from '@/components/ui/toast'

export function useProfile(session: string | null) {
  const { addToast } = useToast()
  const [username, setUsername] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [avatar, setAvatar] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [myOpenGames, setMyOpenGames] = useState<Game[]>([])
  const [myCompletedGames, setMyCompletedGames] = useState<Game[]>([])

  const handleUpdateUser = async () => {
    const response = await fetch('/api/update-user', {
      method: 'PATCH',
      headers: {
        'x-para-session': session || '',
      },
      body: JSON.stringify({
        username,
        avatar: avatar || 'https://static.wikifutbol.com/images/b/b8/AthleteDefault.jpg',
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
      const response = await fetch('/api/read-current-user', {
        headers: {
          'x-para-session': session || '',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setUsername(data.username)
        setAvatar(data.avatar)
        setFirstName(data.firstName || '')
        setLastName(data.lastName || '')
      } else {
        const errorData = await response.json()
        addToast(errorData.error || 'Failed to fetch user', 'error')
      }
    }
    fetchUser()
  }, [session])

  useEffect(() => {
    const fetchMyOpenGames = async () => {
      const response = await fetch('/api/read-my-open-games', {
        headers: {
          'x-para-session': session || '',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setMyOpenGames(data)
        console.log(data, 'data')
      } else {
        const errorData = await response.json()
        addToast(errorData.error || 'Failed to fetch my open games', 'error')
      }
    }
    fetchMyOpenGames()
  }, [session])

  useEffect(() => {
    const fetchMyCompletedGames = async () => {
      const response = await fetch('/api/read-my-completed-games', {
        headers: {
          'x-para-session': session || '',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setMyCompletedGames(data)
      } else {
        const errorData = await response.json()
        addToast(errorData.error || 'Failed to fetch my completed games', 'error')
      }
    }
    fetchMyCompletedGames()
  }, [session])

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
  }
}
