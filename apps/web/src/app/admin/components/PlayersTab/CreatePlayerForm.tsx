interface CreatePlayerFormProps {
  newPlayer: {
    name: string
    team: string
    position: string
    jerseyNumber: number
    age: number
    picture: string
  }
  setNewPlayer: (player: any) => void
  handleCreatePlayer: () => void
}

export default function CreatePlayerForm({ newPlayer, setNewPlayer, handleCreatePlayer }: CreatePlayerFormProps) {
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
              value={newPlayer.team}
              onChange={(e) => setNewPlayer({ ...newPlayer, team: e.target.value })}
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
