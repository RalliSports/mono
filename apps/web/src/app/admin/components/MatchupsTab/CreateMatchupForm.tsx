import { Dropdown } from '../../../../components/ui/dropdown'
import { Team } from '../types'

interface CreateMatchupFormProps {
  newMatchUp: {
    homeTeam: {
      id: string
      name: string
      city: string
      country: string
      createdAt: Date
    }
    awayTeam: {
      id: string
      name: string
      city: string
      country: string
      createdAt: Date
    }
    date: string
  }
  setNewMatchUp: (matchup: any) => void
  handleCreateMatchUp: () => void
  teams: Team[]
}

export default function CreateMatchupForm({
  newMatchUp,
  setNewMatchUp,
  handleCreateMatchUp,
  teams,
}: CreateMatchupFormProps) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
      <h4 className="text-lg font-semibold text-white mb-4">Create New Match-up</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-white font-semibold mb-2">Select Player</label>
          <Dropdown
            value={newMatchUp.awayTeam.id}
            onChange={(value: string) =>
              setNewMatchUp({ ...newMatchUp, awayTeam: { ...newMatchUp.awayTeam, id: value } })
            }
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
            value={newMatchUp.homeTeam.id}
            onChange={(value: string) =>
              setNewMatchUp({ ...newMatchUp, homeTeam: { ...newMatchUp.homeTeam, id: value } })
            }
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
            value={newMatchUp.date}
            onChange={(e) => setNewMatchUp({ ...newMatchUp, date: e.target.value })}
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
