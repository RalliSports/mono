import { useState } from 'react'
import { Dropdown } from '../../../../components/ui/dropdown'
import { LineCreate, MatchupsFindAllInstance } from '@repo/server'

interface CreateLineFormProps {
  newLine: {
    playerId: string
    statTypeId: string
    value: number
    id: string
    gameDate: string
  }
  setNewLine: (line: Partial<LineCreate> & { playerId: string; statTypeId: string; value: number; id: string }) => void
  handleCreateLine: () => Promise<void>
  matchUps: MatchupsFindAllInstance[]
}

export default function CreateLineForm({ newLine, setNewLine, handleCreateLine, matchUps }: CreateLineFormProps) {
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
          <span className="text-lg">📈</span>
        </span>
        Create New Line
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">Select Game</label>
            <Dropdown
              value={newLine.id}
              onChange={(value: string) => setNewLine({ ...newLine, id: value })}
              placeholder="Select a game"
              options={[
                { value: '', label: 'Select a game', disabled: true },
                ...matchUps.map((matchUp: MatchupsFindAllInstance) => ({
                  value: matchUp.id,
                  label: `${matchUp.homeTeam?.name ?? 'Home'} vs ${matchUp.awayTeam?.name ?? 'Away'} (${matchUp.startsAt ? new Date(matchUp.startsAt).toLocaleDateString() : ''})`,
                  icon: '🏈',
                })),
              ]}
              searchable={true}
            />
          </div>
        </div>
      </div>

      {/* Create Line Button - Full Width at Bottom */}
      <div className="mt-6">
        <button
          onClick={async () => {
            setIsCreating(true)
            await handleCreateLine()
            setIsCreating(false)
          }}
          disabled={isCreating}
          className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
        >
          {isCreating ? 'Creating Lines...' : 'Create Lines'}
        </button>
      </div>
    </div>
  )
}
