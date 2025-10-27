import LineCard from './LineCard'
import { SportsDropdown } from '../../../../components/ui/dropdown'
import { LinesServiceGetAllLinesInstance } from '@repo/server'
import { useState } from 'react'
import { useLines } from '@/hooks/api'

export default function ResolveLinesTab() {
  const linesQuery = useLines()

  const lines = (linesQuery.query.data || []) as LinesServiceGetAllLinesInstance[]
  const filteredLines = lines.filter((line) => line.actualValue === null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('')

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
          <LineCard line={line} key={line.id} />
        ))}
      </div>
    </div>
  )
}
