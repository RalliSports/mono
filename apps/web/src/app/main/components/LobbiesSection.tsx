import { useRouter } from 'next/navigation'
import LobbyCard from '@/components/main-feed/lobby-card'
import { GamesServiceFindAll, GamesServiceFindAllInstance } from '@repo/server'
interface LobbiesSectionProps {
  lobbiesData: GamesServiceFindAll
}

export default function LobbiesSection({ lobbiesData, }: LobbiesSectionProps) {
  const router = useRouter()
  const totalActiveLobbies = lobbiesData.length

  const CreateLobbyButton = ({ isMobile }: { isMobile: boolean }) => (
    <button
      onClick={() => router.push('/create-game')}
      className={`${
        isMobile
          ? 'bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-md border border-blue-400/30 hover:border-blue-400/50 text-white font-bold py-2 px-4 rounded-xl'
          : 'bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-md border border-blue-400/30 hover:border-blue-400/50 text-white font-bold py-3 px-6 rounded-xl'
      } transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-400/20 flex items-center space-x-2 group relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <svg
        className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300 relative z-10 text-blue-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <span className={`${isMobile ? 'text-sm' : ''} relative z-10`}>{isMobile ? 'Create' : 'Create Lobby'}</span>
    </button>
  )

  const ViewAllButton = () => (
    <button
      onClick={() => router.push('/lobbies')}
      className="w-full py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white font-semibold hover:bg-slate-700/50 transition-all duration-300 flex items-center justify-center space-x-2 group"
    >
      <span>View All Lobbies</span>
      <svg
        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </button>
  )


  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
      {/* Open Lobbies Sidebar (1/3 width) */}
      <div className="lg:col-span-3">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">Open Lobbies</h2>
          <CreateLobbyButton isMobile={false} />
        </div>

        <div className="mb-4 flex items-center justify-center">
          <div className="text-[#FFAB91] font-bold text-xl">{totalActiveLobbies} Active</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lobbiesData.slice(0, 12).map((lobby) => (
            <LobbyCard key={lobby.id} lobby={lobby} />
          ))}
        </div>

        {/* View More Button */}
        <ViewAllButton />
      </div>
    </div>
  )
}
