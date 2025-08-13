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
  console.log('games', games)

  return transformGamesToLobbies(games)
}

type Game = {
  id: string
  title: string
  participants?: { id: string }[]
  maxParticipants?: number
  depositAmount?: number
  maxBet?: number
  gameMode?: { label: string }
  creator?: { walletAddress: string; username: string }
  status: 'waiting' | 'active' | 'complete' | 'pending'
}

export type Lobby = {
  id: string
  title: string
  sport: string
  sportIcon: string
  participants: number
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
    const participants = game.participants?.length || 0
    const maxParticipants = game.maxParticipants || 1
    const buyIn = game.depositAmount || 0
    const maxBet = game.maxBet ?? buyIn // fallback
    const sport = getSport(game.gameMode?.label || '')
    const wallet = game.creator?.walletAddress || '0x??'
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
      prizePool: maxParticipants * maxBet,
      legs: maxBet || 1, // updated here
      timeLeft: '1h 30m', // static placeholder
      host: {
        username,
        avatar: wallet.slice(0, 2),
      },
      isUrgent: participants / maxParticipants >= 0.75,
      status, // Added status field
    }
  })
}
