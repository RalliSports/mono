import { useState, useEffect } from 'react'
import { User, Game } from '../components/types'

export function useProfile(session: string | null) {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [avatar, setAvatar] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [myOpenGames, setMyOpenGames] = useState<Game[]>([])

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
      const data = await response.json()
      setUser(data)
      setUsername(data.username)
      setAvatar(data.avatar)
      setFirstName(data.firstName || '')
      setLastName(data.lastName || '')
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
      const data = await response.json()
      setMyOpenGames(data)
      console.log(data, 'data')
    }
    fetchMyOpenGames()
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
    handleUpdateUser,
  }
}
