import { useState } from 'react'
import { Dropdown } from '../../../../components/ui/dropdown'
import { CreateMatchupDtoType, TeamServiceFindOne } from '@repo/server'
import { useMatchups, useTeams } from '@/hooks/api'
import { useToast } from '@/components/ui/toast'

export default function CreateMatchupForm() {
  const [newMatchUp, setNewMatchUp] = useState<CreateMatchupDtoType>({
    homeTeamId: '',
    awayTeamId: '',
    startsAtTimestamp: 0,
    espnEventId: '',
  })
  const teamsQuery = useTeams()
  const { addToast } = useToast()
  const matchupsQuery = useMatchups()

  const teams = (teamsQuery.data || []) as TeamServiceFindOne[]

  const handleCreateMatchUp = async () => {
    if (!newMatchUp.homeTeamId || !newMatchUp.awayTeamId || !newMatchUp.startsAtTimestamp) {
      addToast('Please fill in all fields', 'error')
      return
    }

    if (newMatchUp.homeTeamId === newMatchUp.awayTeamId) {
      addToast('Home and away teams must be different', 'error')
      return
    }

    const matchDate = new Date(newMatchUp.startsAtTimestamp)
    if (isNaN(matchDate.getTime())) {
      addToast('Please enter a valid date', 'error')
      return
    }

    try {
      await matchupsQuery.create.mutateAsync({
        startsAtTimestamp: newMatchUp.startsAtTimestamp,
        espnEventId: newMatchUp.espnEventId,
        homeTeamId: newMatchUp.homeTeamId,
        awayTeamId: newMatchUp.awayTeamId,
      })

      addToast('Match-up created successfully!', 'success')
    } catch (error) {
      console.error('Error creating matchup:', error)
      addToast('Failed to create match-up', 'error')
    }
  }
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-semibold text-white mb-4">Create New Match-up</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-white font-semibold mb-2">Select Player</label>
          <Dropdown
            value={newMatchUp.awayTeamId}
            onChange={(value: string) => setNewMatchUp({ ...newMatchUp, awayTeamId: value })}
            placeholder="Select the away team"
            options={[
              { value: '', label: 'Select the away team', disabled: true },
              ...teams.map((team) => ({
                value: team.id,
                label: `${team.name}`,
                icon: '👤',
              })),
            ]}
            searchable={true}
          />
        </div>
        <div>
          <label className="block text-white font-semibold mb-2">Select Player</label>
          <Dropdown
            value={newMatchUp.homeTeamId}
            onChange={(value: string) => setNewMatchUp({ ...newMatchUp, homeTeamId: value })}
            placeholder="Select the home team"
            options={[
              { value: '', label: 'Select the home team', disabled: true },
              ...teams.map((team) => ({
                value: team.id,
                label: `${team.name}`,
                icon: '👤',
              })),
            ]}
            searchable={true}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
          <input
            type="datetime-local"
            value={newMatchUp.startsAtTimestamp}
            onChange={(e) => setNewMatchUp({ ...newMatchUp, startsAtTimestamp: parseInt(e.target.value) })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
          />
        </div>
      </div>
      <button
        onClick={handleCreateMatchUp}
        className="mt-6 w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
      >
        Create Match-up
      </button>
    </div>
  )
}
