import { useState, useEffect } from 'react'
import { useToast } from '../../../components/ui/toast'
import { Team, Player, Game, MatchUp } from '../components/types'
import { LineFindAllInstance, StatsFindById } from '@repo/server'

export function useAdminData(session: string | null) {
  const { addToast } = useToast()

  // State for all data
  const [teams, setTeams] = useState<Team[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [lines, setLines] = useState<LineFindAllInstance[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [matchUps, setMatchUps] = useState<MatchUp[]>([])
  const [stats, setStats] = useState<StatsFindById[]>([])

  // Form states
  const [newStat, setNewStat] = useState({
    name: '',
    description: '',
    customId: 0,
  })

  const [newPlayer, setNewPlayer] = useState({
    name: '',
    team: '',
    position: '',
    jerseyNumber: 0,
    age: 0,
    picture: '',
  })

  const [newLine, setNewLine] = useState({
    playerId: '',
    statTypeId: '',
    value: 0,
    id: '',
    gameDate: '',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('all')

  // New matchup form state
  const [newMatchUp, setNewMatchUp] = useState({
    homeTeam: {
      id: '',
      name: '',
      city: '',
      country: '',
      createdAt: new Date(),
    },
    awayTeam: {
      id: '',
      name: '',
      city: '',
      country: '',
      createdAt: new Date(),
    },
    date: '',
  })

  // Resolution state for lines
  const [resolvingLine, setResolvingLine] = useState<string | null>(null)
  const [resolutionData, setResolutionData] = useState({
    actualValue: '',
    resolutionReason: '',
  })

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      const response = await fetch('/api/read-teams', {
        method: 'GET',
        headers: {
          'x-para-session': session || '',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setTeams(data)
      } else {
        const errorData = await response.json()
        addToast(errorData.error || 'Failed to fetch teams', 'error')
      }
    }
    fetchTeams()
  }, [session])

  // Fetch players
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('/api/fetch-athletes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-para-session': session || '',
          },
        })

        if (response.ok) {
          const fetchedPlayers = await response.json()
          setPlayers(fetchedPlayers)
        } else {
          console.error('Failed to fetch players:', response.statusText)
          addToast('Failed to fetch players', 'error')
        }
      } catch (error) {
        console.error('Error fetching players:', error)
        addToast('Error fetching players', 'error')
      }
    }

    if (session) {
      fetchPlayers()
    }
  }, [session, addToast])

  // Fetch lines
  useEffect(() => {
    const fetchLines = async () => {
      try {
        const response = await fetch('/api/read-lines', {
          method: 'GET',
          headers: {
            'x-para-session': session || '',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setLines(data)
        } else {
          const errorData = await response.json()
          addToast(errorData.error || 'Failed to fetch lines', 'error')
        }
      } catch (error) {
        console.error('Error fetching lines:', error)
        setLines([])
      }
    }
    fetchLines()
  }, [session])

  // Fetch games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/read-open-games', {
          method: 'GET',
          headers: {
            'x-para-session': session || '',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setGames(data)
        } else {
          const errorData = await response.json()
          addToast(errorData.error || 'Failed to fetch games', 'error')
        }
      } catch (error) {
        console.error('Error fetching matchups:', error)
        setGames([])
      }
    }
    fetchGames()
  }, [session])

  // Fetch matchups
  useEffect(() => {
    const fetchMatchups = async () => {
      try {
        const response = await fetch('/api/read-open-matchups', {
          method: 'GET',
          headers: {
            'x-para-session': session || '',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setMatchUps(data)
        } else {
          const errorData = await response.json()
          addToast(errorData.error || 'Failed to fetch matchups', 'error')
        }
      } catch (error) {
        console.error('Error fetching matchups:', error)
        setMatchUps([])
      }
    }
    fetchMatchups()
  }, [session])

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/read-stats', {
          method: 'GET',
          headers: {
            'x-para-session': session || '',
          },
        })
        const data = await response.json()
        if (response.ok) {
          setStats(data)
        } else {
          const errorData = await response.json()
          addToast(errorData.error || 'Failed to fetch stats', 'error')
        }
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats([])
      }
    }
    fetchStats()
  }, [session])

  // API handlers
  const handleCreateStat = async () => {
    if (!newStat.name || !newStat.description || !newStat.customId) {
      addToast('Please fill in all fields', 'error')
      return
    }

    setNewStat({
      name: '',
      description: '',
      customId: 0,
    })

    const apiData = {
      name: newStat.name,
      description: newStat.description,
      customId: newStat.customId,
    }
    try {
      const response = await fetch('/api/create-stat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-para-session': session || '',
        },
        body: JSON.stringify(apiData),
      })
      if (response.ok) {
        addToast('Stat type created successfully!', 'success')
      } else {
        const errorData = await response.json()
        addToast(errorData.error || 'Failed to create stat', 'error')
      }
    } catch (error) {
      console.error('Error creating stat:', error)
      addToast('Error creating stat', 'error')
    }
  }

  const handleCreatePlayer = async () => {
    if (!newPlayer.name || !newPlayer.team || !newPlayer.jerseyNumber || !newPlayer.position || !newPlayer.age) {
      addToast('Please fill in all required fields', 'error')
      return
    }

    try {
      const apiData = {
        name: newPlayer.name,
        team: newPlayer.team,
        position: newPlayer.position,
        jerseyNumber: newPlayer.jerseyNumber,
        age: newPlayer.age,
        picture: newPlayer.picture || undefined, // optional field
      }

      const response = await fetch('/api/create-athlete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-para-session': session || '',
        },
        body: JSON.stringify(apiData),
      })

      if (response.ok) {
        const newPlayerData = await response.json()

        // Add the new player to the local state
        setPlayers([...players, newPlayerData])

        // Reset the form
        setNewPlayer({
          name: '',
          team: '',
          position: '',
          jerseyNumber: 0,
          age: 0,
          picture: '',
        })

        addToast('Player added successfully!', 'success')
      } else {
        const errorData = await response.json()
        addToast(errorData.error || 'Failed to create player', 'error')
      }
    } catch (error) {
      console.error('Error creating player:', error)
      addToast('Error creating player', 'error')
    }
  }

  const handleCreateLine = async () => {
    if (!newLine.playerId || !newLine.statTypeId || !newLine.value || !newLine.id) {
      addToast('Please fill in all fields', 'error')
      return
    }

    const apiData = {
      athleteId: newLine.playerId,
      statId: newLine.statTypeId,
      matchupId: newLine.id,
      predictedValue: newLine.value,
      startsAtTimestamp: new Date(newLine.gameDate).getTime(),
    }

    const response = await fetch('/api/create-line', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': session || '',
      },
      body: JSON.stringify(apiData),
    })

    const result = await response.json()

    if (result.error) {
      addToast(result.error, 'error')
      return
    }

    addToast('Line created successfully!', 'success')
  }

  const handleResolveLine = async (lineId: string, actualValue: number) => {
    const apiData = {
      lineId: lineId,
      actualValue: actualValue,
    }
    const response = await fetch('/api/resolve-line', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': session || '',
      },
      body: JSON.stringify(apiData),
    })

    if (response.ok) {
      addToast(`Line resolved successfully! (${actualValue})`, 'success')
    } else {
      const errorData = await response.json()
      addToast(errorData.error || 'Failed to resolve line', 'error')
    }
  }

  const handleResolveGame = async (gameId: string) => {
    const apiData = {
      gameId: gameId,
    }
    const response = await fetch('/api/resolve-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': session || '',
      },
      body: JSON.stringify(apiData),
    })

    if (response.ok) {
      addToast('Game resolved successfully!', 'success')
    } else {
      const errorData = await response.json()
      addToast(errorData.error || 'Failed to resolve game', 'error')
    }
  }

  const handleCreateMatchUp = async () => {
    if (!newMatchUp.homeTeam || !newMatchUp.awayTeam || !newMatchUp.date) {
      addToast('Please fill in all fields', 'error')
      return
    }

    if (newMatchUp.homeTeam === newMatchUp.awayTeam) {
      addToast('Home and away teams must be different', 'error')
      return
    }

    const matchDate = new Date(newMatchUp.date)
    if (isNaN(matchDate.getTime())) {
      addToast('Please enter a valid date', 'error')
      return
    }

    const apiData = {
      homeTeamId: newMatchUp.homeTeam.id,
      awayTeamId: newMatchUp.awayTeam.id,
      startsAtTimestamp: matchDate.getTime(),
    }

    const response = await fetch('/api/create-matchup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': session || '',
      },
      body: JSON.stringify(apiData),
    })

    if (response.ok) {
      addToast('Match-up created successfully!', 'success')
    } else {
      const errorData = await response.json()
      addToast(errorData.error || 'Failed to create match-up', 'error')
    }
  }

  // Filter functions
  const filteredLines = lines.filter((line) => {
    const matchesSearch =
      line.athlete?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.stat?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = selectedSport === 'all' || line.matchup?.homeTeam?.name === selectedSport
    return matchesSearch && matchesSport
  })

  const filteredGames = games

  return {
    // Data
    teams,
    players,
    lines,
    games,
    matchUps,
    stats,

    // Form states
    newStat,
    setNewStat,
    newPlayer,
    setNewPlayer,
    newLine,
    setNewLine,
    newMatchUp,
    setNewMatchUp,

    // UI states
    searchTerm,
    setSearchTerm,
    selectedSport,
    setSelectedSport,
    resolvingLine,
    setResolvingLine,
    resolutionData,
    setResolutionData,

    // Handlers
    handleCreateStat,
    handleCreatePlayer,
    handleCreateLine,
    handleResolveLine,
    handleResolveGame,
    handleCreateMatchUp,

    // Filtered data
    filteredLines,
    filteredGames,
  }
}
