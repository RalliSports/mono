import { useToast } from '@/components/ui/toast'
import { useAthletes } from '@/hooks/api/use-athletes'
import { CreateAthleteDtoType } from '@repo/server'
import { useState } from 'react'

export default function CreatePlayerForm() {
  const { addToast } = useToast()
  const athletesQuery = useAthletes()
  const [newPlayer, setNewPlayer] = useState<CreateAthleteDtoType>({
    name: '',
    teamId: '',
    position: '',
    jerseyNumber: 0,
    age: 0,
    picture: '',
    espnAthleteId: '',
  })

  const handleCreatePlayer = async () => {
    if (!newPlayer.name || !newPlayer.teamId || !newPlayer.jerseyNumber || !newPlayer.position || !newPlayer.age) {
      addToast('Please fill in all required fields', 'error')
      return
    }

    try {
      await athletesQuery.create.mutateAsync({
        espnAthleteId: '',
        name: newPlayer.name,
        position: newPlayer.position,
        jerseyNumber: newPlayer.jerseyNumber,
        age: newPlayer.age,
        picture: newPlayer.picture || '',
        teamId: newPlayer.teamId,
      })

      setNewPlayer({
        name: '',
        teamId: '',
        position: '',
        jerseyNumber: 0,
        age: 0,
        picture: '',
        espnAthleteId: '',
      })

      addToast('Player added successfully!', 'success')
    } catch (error) {
      console.error('Error creating player:', error)
      addToast('Error creating player', 'error')
    }
  }
  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
          <span className="text-lg">👤</span>
        </span>
        Add New Player
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-white font-semibold mb-2">Player Name</label>
          <input
            type="text"
            value={newPlayer.name}
            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
            placeholder="e.g., LeBron James"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-semibold mb-2">Team</label>
            <input
              type="text"
              value={newPlayer.teamId}
              onChange={(e) => setNewPlayer({ ...newPlayer, teamId: e.target.value })}
              placeholder="e.g., LAL"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Jersey #</label>
            <input
              type="number"
              value={newPlayer.jerseyNumber}
              onChange={(e) =>
                setNewPlayer({
                  ...newPlayer,
                  jerseyNumber: parseInt(e.target.value),
                })
              }
              placeholder="e.g., 23"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-semibold mb-2">Position</label>
            <input
              type="text"
              value={newPlayer.position}
              onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
              placeholder="e.g., SF, QB, FW"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Age</label>
            <input
              type="number"
              value={newPlayer.age}
              onChange={(e) => setNewPlayer({ ...newPlayer, age: parseInt(e.target.value) })}
              placeholder="e.g., 25"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Picture URL (Optional)</label>
          <input
            type="url"
            value={newPlayer.picture}
            onChange={(e) => setNewPlayer({ ...newPlayer, picture: e.target.value })}
            placeholder="e.g., https://example.com/player-image.jpg"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
          />
        </div>

        <button
          onClick={handleCreatePlayer}
          className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
        >
          Add Player
        </button>
      </div>
    </div>
  )
}
