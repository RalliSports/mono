import { GamesFindOne } from '@repo/server'
import Image from 'next/image'
interface GameHeaderProps {
  lobby: GamesFindOne
}

export default function GameHeader({ lobby }: GameHeaderProps) {
  return (
    <div className="pt-6 pb-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-xl overflow-hidden">
              {lobby.title ? (
                <Image
                  src={lobby.creator?.avatar || ''}
                  alt={lobby.title}
                  className="w-16 h-16 object-cover rounded-xl"
                  width={64}
                  height={64}
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(lobby.creator?.username || 'Anonymous User')}&background=0D8ABC&color=fff&size=128`
                  }}
                />
              ) : (
                <span className="text-white font-bold text-3xl">{lobby.title}</span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 text-lg shadow-lg">👑</div>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-xl truncate">{lobby.title}</h3>
            <p className="text-slate-400 text-sm">
              Host • Created {new Date(lobby.createdAt || '').toLocaleDateString()}
            </p>
            <div className="mt-2">
              <h2 className="text-lg font-semibold text-white truncate leading-tight">{lobby.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-300 font-medium text-sm">
                  {lobby.participants.length}/{lobby.maxParticipants} players
                </span>
                <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                <span className="text-slate-400 text-sm">{lobby.numBets} legs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
