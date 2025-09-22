import { useState } from 'react'
import { Dropdown } from '../../../../components/ui/dropdown'
import { MatchupsFindAllInstance, MatchupsGetMatchupsWithOpenLines } from '@repo/server'
import { useMatchups } from '@/hooks/api'
import { useToast } from '@/components/ui/toast'

export default function ResolveLinesTab() {
  const { addToast } = useToast()
  const matchupsQuery = useMatchups()
  const matchUps = (matchupsQuery.matchupsWithOpenLines.data || []) as MatchupsGetMatchupsWithOpenLines
  const [isResolving, setIsResolving] = useState(false)
  const [matchupToResolve, setMatchupToResolve] = useState<MatchupsFindAllInstance>(matchUps[0])

  const handleResolveLinesForMatchup = async (matchupId: string) => {
    try {
      await matchupsQuery.resolve.mutateAsync({ matchupId })
      addToast(`Lines resolved successfully!`, 'success')
    } catch (error) {
      console.error('Error resolving line:', error)
      addToast('Failed to resolve line', 'error')
    }
  }
  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
          <span className="text-lg">📈</span>
        </span>
        Resolve Lines
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">Select Game</label>
            <Dropdown
              value={matchupToResolve?.id}
              onChange={(value: string) =>
                setMatchupToResolve(matchUps.find((matchUp) => matchUp.id === value) ?? matchUps[0])
              }
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
            setIsResolving(true)
            await handleResolveLinesForMatchup(matchupToResolve.id)
            setIsResolving(false)
          }}
          disabled={isResolving}
          className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
        >
          {isResolving ? 'Resolving Lines...' : 'Resolve Lines'}
        </button>
      </div>
    </div>
  )
}
