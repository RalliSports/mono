import { useState, useMemo } from 'react'
import { GamesServiceFindAll } from '@repo/server'
export const useLobbiesFilters = (lobbiesData: GamesServiceFindAll) => {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter lobbies based on selected filter and search query
  const filteredLobbies = useMemo(() => {
    return lobbiesData.filter((lobby) => {
      const matchesFilter = selectedFilter === 'all' || lobby.status === selectedFilter
      const matchesSearch = lobby.title?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesFilter && matchesSearch
    })
  }, [lobbiesData, selectedFilter, searchQuery])

  return {
    selectedFilter,
    setSelectedFilter,
    searchQuery,
    setSearchQuery,
    filteredLobbies,
  }
}
