import { useState } from 'react'
import { Dropdown } from '../../../../components/ui/dropdown'
import { CreateLineDtoType, MatchupsServiceGetAllMatchupsInstance } from '@repo/server'
import { useMatchups, useLines } from '@/hooks/api'
import { useToast } from '@/components/ui/toast'

export default function CreateLineForm() {
  const { addToast } = useToast()
  const linesQuery = useLines()
  const [newLine, setNewLine] = useState<CreateLineDtoType>({
    athleteId: '',
    statId: '',
    matchupId: '',
    predictedValue: 0,
    oddsOver: 0,
    oddsUnder: 0,
  })

  const matchUpsQuery = useMatchups()
  const matchUps = (matchUpsQuery.query.data || []) as MatchupsServiceGetAllMatchupsInstance[]
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateLine = async () => {
    try {
      await linesQuery.create.mutateAsync({
        matchupId: newLine.matchupId,
        athleteId: newLine.athleteId,
        statId: newLine.statId,
        predictedValue: newLine.predictedValue,
        oddsOver: newLine.oddsOver,
        oddsUnder: newLine.oddsUnder,
      })

      addToast('Lines created successfully!', 'success')
    } catch (error) {
      console.error('Error creating line:', error)
      addToast('Error creating line', 'error')
    }
  }

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
              value={newLine.matchupId}
              onChange={(value: string) => setNewLine({ ...newLine, matchupId: value })}
              placeholder="Select a game"
              options={[
                { value: '', label: 'Select a game', disabled: true },
                ...matchUps.map((matchUp: MatchupsServiceGetAllMatchupsInstance) => ({
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
