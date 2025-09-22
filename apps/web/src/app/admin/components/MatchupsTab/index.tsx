import CreateMatchupForm from './CreateMatchupForm'
import MatchupsList from './MatchupsList'

export default function MatchupsTab() {
  return (
    <div className="space-y-6">
      {/* Match-ups Section */}
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
            <span className="text-lg">⚔️</span>
          </span>
          Match-ups
        </h2>

        {/* Create Match-up Form */}
        <CreateMatchupForm />

        {/* Match-ups List */}
        <MatchupsList />
      </div>
    </div>
  )
}
