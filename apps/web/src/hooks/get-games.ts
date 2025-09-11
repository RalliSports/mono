'use client'

import { useQuery } from '@tanstack/react-query'

//send api request to /api/games
export const fetchGames = async () => {
  const response = await fetch(`/api/games`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      revalidate: 60, // Revalidate every 60 seconds
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch games')
  }

  const games = await response.json()

  return transformGamesToLobbies(games)
}

// New hook version
export function useLobbies() {
  return useQuery({
    queryKey: ['lobbies'],
    queryFn: fetchGames,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

type Game = {
  id: string
  title: string
  participants?: { id: string; userId: string; user: { username: string; avatar: string; id: string } }[]
  maxParticipants?: number
  depositAmount?: number
  numBets?: number
  imageUrl?: string
  gameMode?: { label: string }
  creator?: { walletAddress: string; username: string; avatar: string }
  status: 'waiting' | 'active' | 'complete' | 'pending'
}

export type Lobby = {
  id: string
  title: string
  sport: string
  sportIcon: string
  imageUrl: string
  participants: { id: string; userId: string; user: { username: string; avatar: string; id: string } }[]
  maxParticipants: number
  buyIn: number
  prizePool: number
  legs: number
  timeLeft: string
  host: {
    username: string
    avatar: string
  }
  isUrgent: boolean
  status: 'waiting' | 'active' | 'complete' | 'pending'
}

function transformGamesToLobbies(games: Game[]): Lobby[] {
  const getSport = (label: string): string => {
    if (label.toLowerCase().includes('weekly')) return 'NFL'
    if (label.toLowerCase().includes('head')) return 'NFL'
    if (label.toLowerCase().includes('quick')) return 'NBA'
    return 'Soccer'
  }

  const getSportIcon = (sport: string): string => {
    switch (sport) {
      case 'NBA':
        return '🏀'
      case 'NFL':
        return '🏈'
      case 'Soccer':
        return '⚽'
      default:
        return '🎮'
    }
  }

  return games.map((game) => {
    const participants = game.participants || []
    const maxParticipants = game.maxParticipants || 1
    const buyIn = game.depositAmount || 0
    const sport = getSport(game.gameMode?.label || '')
    const username = game.creator?.username || '0x??'

    // Determine status based on game data
    let status: 'waiting' | 'active' | 'complete' | 'pending'
    if (game.status === 'waiting') {
      status = 'waiting'
    } else if (game.status === 'active') {
      status = 'active'
    } else if (game.status === 'pending') {
      status = 'pending'
    } else {
      status = 'complete'
    }

    return {
      id: game.id,
      title: game.title,
      sport,
      sportIcon: getSportIcon(sport),
      participants,
      maxParticipants,
      buyIn,
      prizePool: maxParticipants * (game.depositAmount || 0),
      legs: game.numBets || 1, // updated here
      timeLeft: '1h 30m', // static placeholder
      imageUrl: game.imageUrl || '',
      host: {
        username,
        avatar: game.creator?.avatar || '',
      },
      isUrgent: participants.length / maxParticipants >= 0.75,
      status, // Added status field
    }
  })
}
