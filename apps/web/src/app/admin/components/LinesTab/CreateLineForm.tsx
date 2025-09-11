import { useState } from 'react'
import { Dropdown } from '../../../../components/ui/dropdown'
import { StatsFindById, LineCreate, AthletesFindOne, MatchupsFindById } from '@repo/server'

interface CreateLineFormProps {
  newLine: {
    playerId: string;
    statTypeId: string;
    value: number;
    id: string;
    gameDate: string;
  };
  setNewLine: (line: Partial<LineCreate> & { playerId: string; statTypeId: string; value: number; id: string }) => void;
  handleCreateLine: () => Promise<void>;
  players: AthletesFindOne[];
  stats: StatsFindById[];
  matchUps: MatchupsFindById[];
}

export default function CreateLineForm({
  newLine,
  setNewLine,
  handleCreateLine,
  players,
  stats,
  matchUps,
}: CreateLineFormProps) {
  const [isCreating, setIsCreating] = useState(false)
  const filteredPlayers = players.filter((player: AthletesFindOne) => {
    if (newLine.id) {
      const matchUp = matchUps.find((matchUp: MatchupsFindById) => matchUp.id === newLine.id)
      // Try to match by teamId or fallback to name if available
      return (
        (player.teamId && (player.teamId === matchUp?.homeTeamId || player.teamId === matchUp?.awayTeamId))
      )
    }
    return true
  })
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
            <label className="block text-white font-semibold mb-2">Select Player</label>
            <Dropdown
              value={newLine.playerId}
              onChange={(value: string) => setNewLine({ ...newLine, playerId: value })}
              placeholder="Select a player"
              options={[
                { value: '', label: 'Select a player', disabled: true },
                ...filteredPlayers.map((player: AthletesFindOne) => ({
                  value: player.id,
                  label: `${player.name ?? 'Unknown'} (${player.teamId ?? ''})`,
                  icon: '👤',
                })),
              ]}
              searchable={true}
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Select Stat Type</label>
            <Dropdown
              value={newLine.statTypeId}
              onChange={(value: string) => setNewLine({ ...newLine, statTypeId: value })}
              placeholder="Select stat type"
              options={[
                {
                  value: '',
                  label: 'Select stat type',
                  disabled: true,
                },
                ...stats.map((stat: StatsFindById) => ({
                  value: stat.id,
                  label: `${stat.displayName} (${stat.customId})`,
                  icon: '📊',
                })),
              ]}
              searchable={true}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">Line Value</label>
            <input
              type="number"
              step="0.5"
              value={newLine.value}
              onChange={(e) => setNewLine({ ...newLine, value: parseFloat(e.target.value) })}
              placeholder="e.g., 28.5"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
            />
          </div>
          <div>
            <label className="block text-white font-semibold mb-2">Select Game</label>
            <Dropdown
              value={newLine.id}
              onChange={(value: string) => setNewLine({ ...newLine, id: value })}
              placeholder="Select a game"
              options={[
                { value: '', label: 'Select a game', disabled: true },
                ...matchUps.map((matchUp: MatchupsFindById) => ({
                  value: matchUp.id,
                  label: `${matchUp.homeTeamId ?? 'Home'} vs ${matchUp.awayTeamId ?? 'Away'} (${matchUp.startsAt ? new Date(matchUp.startsAt).toLocaleDateString() : ''})`,
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
          {isCreating ? 'Creating Line...' : 'Create Line'}
        </button>
      </div>
    </div>
  )
}
