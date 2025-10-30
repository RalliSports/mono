import { PlayerSearchFilters } from '@/components/ui/player-search-filters'
import { AthletesServiceGetActiveAthletesWithUnresolvedLines } from '@repo/server'
import { useState, useMemo } from 'react'
import { AthletePickCard, LoadingStates, SelectedPick } from '.'

interface PlayerFilters {
  search: string
  teams: string[]
  positions: string[]
  statTypes: string[]
}

interface AthletesListProps {
  athletes: AthletesServiceGetActiveAthletesWithUnresolvedLines
  handlePickSelection: (athleteId: string, statIndex: number, betType: 'over' | 'under') => void
  selectedPicks: SelectedPick[]
  legsRequired: number
}

export default function AthletesList({
  athletes,
  handlePickSelection,
  selectedPicks,
  legsRequired,
}: AthletesListProps) {
  const [filters, setFilters] = useState<PlayerFilters>({
    search: '',
    teams: [],
    positions: [],
    statTypes: [],
  })

  // Generate filter options from athletes data
  const filterOptions = useMemo(() => {
    const teams = new Map<string, { name: string; count: number }>()
    const positions = new Map<string, number>()
    const statTypes = new Map<string, { name: string; count: number }>()

    athletes.forEach((athlete) => {
      // Count teams
      if (athlete.team) {
        const teamKey = athlete.team.abbreviation || athlete.team.name
        const teamName = `${athlete.team.city} ${athlete.team.name}`.trim()
        teams.set(teamKey, {
          name: teamName,
          count: (teams.get(teamKey)?.count || 0) + 1,
        })
      }

      // Count positions
      if (athlete.position) {
        positions.set(athlete.position, (positions.get(athlete.position) || 0) + 1)
      }

      // Count stat types
      athlete.lines?.forEach((line) => {
        if (line.stat?.name) {
          const statKey = line.stat.name
          const statDisplayName = line.stat.displayName || line.stat.name
          statTypes.set(statKey, {
            name: statDisplayName,
            count: (statTypes.get(statKey)?.count || 0) + 1,
          })
        }
      })
    })

    return {
      teams: Array.from(teams.entries())
        .map(([value, data]) => ({
          value,
          label: data.name,
          count: data.count,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),

      positions: Array.from(positions.entries())
        .map(([value, count]) => ({
          value,
          label: value,
          count,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),

      statTypes: Array.from(statTypes.entries())
        .map(([value, data]) => ({
          value,
          label: data.name,
          count: data.count,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    }
  }, [athletes])

  // Filter athletes based on current filters
  const filteredAthletes = useMemo(() => {
    return athletes.filter((athlete) => {
      // Search filter
      if (filters.search && !athlete.name?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Team filter
      if (filters.teams.length > 0) {
        const athleteTeam = athlete.team?.abbreviation || athlete.team?.name
        if (!athleteTeam || !filters.teams.includes(athleteTeam)) {
          return false
        }
      }

      // Position filter
      if (filters.positions.length > 0 && (!athlete.position || !filters.positions.includes(athlete.position))) {
        return false
      }

      // Stat type filter
      if (filters.statTypes.length > 0) {
        const hasMatchingStat = athlete.lines?.some(
          (line) => line.stat?.name && filters.statTypes.includes(line.stat.name),
        )
        if (!hasMatchingStat) {
          return false
        }
      }

      return true
    })
  }, [athletes, filters])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
            <span className="text-lg">📈</span>
          </span>
          Available Players
        </h3>
        <div className="text-right">
          <div className="text-[#00CED1] font-bold text-lg">{filteredAthletes.length}</div>
          <div className="text-slate-400 text-xs">
            {filteredAthletes.length === athletes.length ? 'Showing' : `of ${athletes.length}`}
          </div>
        </div>
      </div>

      <PlayerSearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        teamOptions={filterOptions.teams}
        positionOptions={filterOptions.positions}
        statTypeOptions={filterOptions.statTypes}
      />

      {filteredAthletes
        .filter((athlete, index, array) => array.findIndex((a) => a.id === athlete.id) === index)
        .map((athlete) => (
          <AthletePickCard
            key={athlete.id}
            athlete={athlete}
            onPickSelection={handlePickSelection}
            selectedPick={selectedPicks.find((pick) => pick.athleteId === athlete.id)}
            isSelectionDisabled={
              selectedPicks.length >= legsRequired && !selectedPicks.find((pick) => pick.athleteId === athlete.id)
            }
          />
        ))}
      <LoadingStates athletesCount={athletes.length} />
    </div>
  )
}
