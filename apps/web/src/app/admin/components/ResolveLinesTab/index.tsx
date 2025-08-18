import LineCard from './LineCard'
import { SportsDropdown } from '../../../../components/ui/dropdown'
import { Line } from '../types'

interface ResolveLinesTabProps {
  filteredLines: Line[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedSport: string
  setSelectedSport: (sport: string) => void
  resolvingLine: string | null
  setResolvingLine: (id: string | null) => void
  resolutionData: {
    actualValue: string
    resolutionReason: string
  }
  setResolutionData: (data: any) => void
  handleResolveLine: (lineId: string, actualValue: number) => void
  addToast: (message: string, type: 'success' | 'error') => void
}

export default function ResolveLinesTab({
  filteredLines,
  searchTerm,
  setSearchTerm,
  selectedSport,
  setSelectedSport,
  resolvingLine,
  setResolvingLine,
  resolutionData,
  setResolutionData,
  handleResolveLine,
  addToast,
}: ResolveLinesTabProps) {
  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
          <span className="text-lg">✅</span>
        </span>
        Resolve Lines
      </h2>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by player or stat name..."
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
          />
        </div>

        <div>
          <SportsDropdown
            value={selectedSport}
            onChange={setSelectedSport}
            includeAll={true}
            placeholder="Filter by sport"
          />
        </div>
      </div>

      {/* Lines List */}
      <div className="space-y-4">
        {filteredLines.map((line) => (
          <LineCard
            key={line.id}
            line={line}
            resolvingLine={resolvingLine}
            setResolvingLine={setResolvingLine}
            resolutionData={resolutionData}
            setResolutionData={setResolutionData}
            handleResolveLine={handleResolveLine}
            addToast={addToast}
          />
        ))}
      </div>
    </div>
  )
}
