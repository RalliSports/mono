import CreateStatForm from './CreateStatForm'
import StatsList from './StatsList'
import { StatsFindById } from '@repo/server'

interface StatsTabProps {
  stats: StatsFindById[]
  newStat: {
    name: string
    description: string
    customId: number
  }
  setNewStat: (stat: any) => void
  handleCreateStat: () => void
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export default function StatsTab({
  stats,
  newStat,
  setNewStat,
  handleCreateStat,
  searchTerm,
  setSearchTerm,
}: StatsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CreateStatForm newStat={newStat} setNewStat={setNewStat} handleCreateStat={handleCreateStat} />
      <StatsList stats={stats} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </div>
  )
}
