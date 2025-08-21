import { useState, useEffect } from 'react'
import { fetchGames } from '@/hooks/get-games'
import type { Lobby } from '@/hooks/get-games'
import type { Athlete } from '../components/types'
import { useToast } from '@/components/ui/toast'

export function useMainPage(session: string | undefined) {
  const { addToast } = useToast()
  const [lobbiesData, setLobbiesData] = useState<Lobby[]>([])
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([])
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [isInSelectionMode, setIsInSelectionMode] = useState(false)
  const [requiredSelections, setRequiredSelections] = useState(0)
  const [profilePopupAthleteId, setProfilePopupAthleteId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  // Load lobbies
  useEffect(() => {
    const loadLobbies = async () => {
      try {
        const fetchedLobbies = await fetchGames()

        setLobbiesData(fetchedLobbies.filter((lobby) => lobby.participants.length < lobby.maxParticipants))
      } catch (error) {
        console.error('Error fetching lobbies:', error)
        setLobbiesData([])
      }
    }

    loadLobbies()
  }, [])

  // Fetch athletes
  useEffect(() => {
    const fetchAthletes = async () => {
      if (!session) return

      try {
        const response = await fetch('/api/read-lines-group-athletes', {
          method: 'GET',
          headers: {
            'x-para-session': session,
          },
        })
        console.log('athletes response', response)
        if (response.ok) {
          const data = await response.json()
          setAthletes(data)
        } else {
          const errorData = await response.json()
          addToast(errorData.error || 'Failed to fetch athletes', 'error')
        }
      } catch (error) {
        console.error('Error fetching lines:', error)
        setAthletes([])
      }
    }

    fetchAthletes()
  }, [session])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileDropdownOpen) {
        const target = event.target as Element
        if (!target.closest('.profile-dropdown')) {
          setIsProfileDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileDropdownOpen])

  return {
    lobbiesData,
    selectedAthletes,
    setSelectedAthletes,
    athletes,
    isInSelectionMode,
    setIsInSelectionMode,
    requiredSelections,
    setRequiredSelections,
    profilePopupAthleteId,
    setProfilePopupAthleteId,
    isSidebarOpen,
    setIsSidebarOpen,
    isProfileDropdownOpen,
    setIsProfileDropdownOpen,
  }
}
