import { SearchBar } from '@/components/ui/searchbar'
import { AthletesServiceGetActiveAthletesWithUnresolvedLines } from '@repo/server'
import { useEffect, useState } from 'react'
import { AthletePickCard, LoadingStates, SelectedPick } from '.'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredAthletes, setFilteredAthletes] = useState(athletes)

  useEffect(() => {
    setFilteredAthletes(athletes.filter((athlete) => athlete.name?.toLowerCase().includes(searchTerm.toLowerCase())))
  }, [searchTerm, athletes])

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
          <div className="text-[#00CED1] font-bold text-lg">{athletes.length}</div>
          <div className="text-slate-400 text-xs">Showing</div>
        </div>
      </div>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} extraContainerClass="px-0" />

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
