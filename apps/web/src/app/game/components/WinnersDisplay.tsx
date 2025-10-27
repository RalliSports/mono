import { GamesServiceFindOne } from '@repo/server'
import Image from 'next/image'
import { useState } from 'react'

interface WinnersDisplayProps {
  lobby: GamesServiceFindOne
}

export default function WinnersDisplay({ lobby }: WinnersDisplayProps) {
  const winners = lobby.participants.filter((p) => p.isWinner)

  if (winners.length === 0) return null

  return (
    <div className="mb-6">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">Game Results</h3>
          <div className="text-emerald-400 text-sm font-medium">
            {winners.length} Winner{winners.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          <div className="flex gap-3 min-w-max">
            {winners.map((winner, index) => (
              <WinnerCard key={winner.id} winner={winner} position={index + 1} lobby={lobby} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function WinnerCard({
  winner,
  position,
}: {
  winner: GamesServiceFindOne['participants'][0]
  position: number
  lobby: GamesServiceFindOne
}) {
  const [imageSrc, setImageSrc] = useState(winner.user?.avatar)

  const handleError = () => {
    setImageSrc('/images/pfp-1.svg')
  }

  const getPositionColor = (pos: number) => {
    switch (pos) {
      case 1:
        return 'text-yellow-400'
      case 2:
        return 'text-slate-300'
      case 3:
        return 'text-amber-600'
      default:
        return 'text-emerald-400'
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105 min-w-[240px] w-[240px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={imageSrc || '/images/pfp-1.svg'}
              alt={winner.user?.username || 'Winner'}
              className="w-full h-full object-cover"
              width={48}
              height={48}
              onError={(e) => {
                e.currentTarget.onerror = handleError
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(winner.user?.username || 'Winner')}&background=0D8ABC&color=fff&size=128`
              }}
            />
          </div>
          <div className="flex flex-col">
            <div className="text-slate-400 text-sm">#{position} Winner</div>
            <div className="text-white font-bold text-base truncate">{winner.user?.username}</div>
          </div>
        </div>
        <div className={`${getPositionColor(position)} font-bold text-xl`}>
          ${winner.amountWon?.toFixed(2) || 'YOU LOST'}
        </div>
      </div>
    </div>
  )
}
