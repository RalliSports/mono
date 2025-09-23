import { GamesServiceFindOne } from '@repo/server'
import ParticipantPicks from './ParticipantPicks'
import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
interface ParticipantCardProps {
  participant: GamesServiceFindOne['participants'][number]
  lobby: GamesServiceFindOne
  isExpanded: boolean
  onToggle: () => void
}

export default function ParticipantCard({ participant, lobby, isExpanded, onToggle }: ParticipantCardProps) {
  const [imageSrc, setImageSrc] = useState(participant.user?.avatar)
  const [hasErrored, setHasErrored] = useState(false)

  const handleError = () => {
    if (!hasErrored) {
      setHasErrored(true)
      setImageSrc('/images/pfp-1.svg') // Use local fallback
    }
  }
  return (
    <div className="space-y-3">
      {/* Enhanced Participant Card */}
      <div
        className={`bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer shadow-2xl ${
          isExpanded ? 'border-[#00CED1] shadow-[#00CED1]/20' : 'hover:border-slate-600 hover:shadow-slate-600/10'
        }`}
        onClick={onToggle}
      >
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-xl overflow-hidden">
                  <Link href={`/profile?userId=${participant.userId}`}>
                    {participant.user?.username ? (
                      <Image
                        src={imageSrc || '/images/pfp-1.svg'}
                        alt={participant.user?.username || 'Anonymous User'}
                        className="w-14 h-14 object-cover rounded-xl"
                        width={56}
                        height={56}
                        onError={(e) => {
                          e.currentTarget.onerror = handleError
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.user?.username || 'Anonymous User')}&background=0D8ABC&color=fff&size=128`
                        }}
                      />
                    ) : (
                      <span className="text-white font-bold text-2xl">
                        {participant.user?.username || 'Anonymous User'}
                      </span>
                    )}
                  </Link>
                </div>
                {participant.user?.username === lobby.creator?.username && (
                  <div className="absolute -top-1 -left-1 text-sm">👑</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-white font-bold text-base leading-tight truncate">
                  {participant.user?.username || 'Anonymous User'}
                </h4>
                <p className="text-slate-400 text-sm mt-1">
                  Joined {new Date(participant.joinedAt || '').toLocaleDateString()} • ${lobby.depositAmount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-slate-300 font-medium">{participant.bets.length} picks</div>
                <div className="text-xs text-slate-500">Ready to play</div>
              </div>
              <div
                className={`transform transition-transform duration-300 text-slate-400 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              >
                ▼
              </div>
            </div>
          </div>

          {/* Enhanced Quick Picks Preview */}
          <div className="mt-4">
            <div className="flex gap-1.5">
              {participant.bets.map((pick) => {
                return (
                  <div key={pick.id} className="flex-1 h-2.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        new Date(pick.line?.matchup?.startsAt || '') > new Date()
                          ? 'bg-slate-600'
                          : pick.line?.status !== 'resolved'
                            ? 'bg-blue-500'
                            : pick.isCorrect
                              ? 'bg-emerald-500'
                              : 'bg-red-500'
                      }`}
                      style={{ width: '100%' }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Expanded Picks */}
      {isExpanded && <ParticipantPicks participant={participant} />}
    </div>
  )
}
