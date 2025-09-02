import Image from 'next/image'
import { GamesFindOne } from '@repo/server'

interface ParticipantsListProps {
  game: GamesFindOne
  expandedParticipants: string[]
  onToggleParticipant: (participantId: string) => void
}

export default function ParticipantsList({ game, expandedParticipants, onToggleParticipant }: ParticipantsListProps) {
  const isParticipantExpanded = (participantId: string) => {
    return expandedParticipants.includes(participantId)
  }

  return (
    <div className="mb-6">
      <div className="mb-4">
        <h3 className="text-white font-bold text-lg mb-2">Current Players ({game.participants.length})</h3>
        <p className="text-slate-400 text-sm">See what picks other players have locked in</p>
      </div>

      <div className="space-y-4">
        {game.participants.map((participant) => (
          <div key={participant.id} className="space-y-3">
            {/* Enhanced Participant Card */}
            <div
              className={`bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer shadow-2xl ${
                isParticipantExpanded(participant.id)
                  ? 'border-[#00CED1] shadow-[#00CED1]/20'
                  : 'hover:border-slate-600 hover:shadow-slate-600/10'
              }`}
              onClick={() => onToggleParticipant(participant.id)}
            >
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-xl overflow-hidden">
                        <Image
                          src={participant.user?.avatar || '/default-avatar.png'}
                          alt={participant.user?.username || 'User'}
                          width={56}
                          height={56}
                        />
                      </div>
                      {participant.user?.id === game.creator?.id && (
                        <div className="absolute -top-1 -left-1 text-sm">👑</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-white font-bold text-base leading-tight truncate">
                        {participant.user?.username || 'Anonymous User'}
                      </h4>
                      <p className="text-slate-400 text-sm mt-1">
                        Joined {new Date(participant.joinedAt || '').toLocaleDateString()} • ${game.depositAmount}
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
                        isParticipantExpanded(participant.id) ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </div>
                  </div>
                </div>

                {/* Enhanced Quick Picks Preview */}
                <div className="mt-4">
                  <div className="flex gap-1.5">
                    {participant.bets.slice(0, 4).map((pick) => (
                      <div key={pick.id} className="flex-1 h-2.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500" style={{ width: '100%' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Expanded Picks */}
            {isParticipantExpanded(participant.id) && (
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300 shadow-2xl shadow-[#00CED1]/10">
                <div className="p-4 border-b border-slate-700/50">
                  <h5 className="text-white font-bold truncate">
                    {participant.user?.username || 'Anonymous User'}&apos;s Picks
                  </h5>
                  <p className="text-slate-400 text-sm">{participant.bets.length} legs selected</p>
                </div>

                <div className="divide-y divide-slate-700/30">
                  {participant.bets.map((pick) => (
                    <div key={pick.id} className="p-4 hover:bg-slate-700/20 transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                            {pick.line?.athleteId ? (
                              <Image
                                src={pick.line?.athlete?.picture || ''}
                                alt={pick.line?.athlete?.name || ''}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback to initials if image fails to load
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  const parent = target.parentElement
                                  if (parent) {
                                    parent.innerHTML = `<span class="text-white font-bold">${pick.line?.athlete?.name || ''}
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')
                                      .toUpperCase()}</span>`
                                  }
                                }}
                              />
                            ) : (
                              <span className="text-white font-bold text-lg">{pick.line?.athleteId}</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h6 className="text-white font-semibold text-sm leading-tight truncate">
                              {pick.line?.athlete?.name}
                            </h6>
                            <p className="text-slate-400 text-xs">Team vs Team</p>
                            <p className="text-slate-500 text-xs">
                              {new Date(pick.line?.matchup?.startsAt || '').toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-white font-semibold text-sm">
                            <span>{pick.line?.stat?.displayName || pick.line?.stat?.name} </span>
                            <span
                              className={`font-bold text-xs ${
                                pick.predictedDirection?.toLowerCase() === 'over' ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              {pick.predictedDirection?.toUpperCase()}{' '}
                              {pick.predictedDirection?.toLowerCase() === 'over' ? '˄' : '˅'}
                            </span>
                            <span> {pick.line?.predictedValue}</span>
                          </div>
                          <div className="text-slate-400 text-xs">Current: {pick.line?.actualValue || 'N/A'}</div>
                        </div>
                      </div>

                      {/* Progress Bar Section */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-slate-300">
                            {pick.line?.actualValue || 0} / {pick.line?.predictedValue}
                          </span>
                        </div>

                        {/* Enhanced Progress Bar with Target Line */}
                        <div className="relative">
                          <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ${
                                pick.isCorrect
                                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                  : pick.line?.actualValue !== null && Number(pick.line?.actualValue || 0) > 0
                                    ? pick.predictedDirection?.toLowerCase() === 'over'
                                      ? Number(pick.line?.actualValue || 0) >= Number(pick.line?.predictedValue || 0)
                                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                        : 'bg-gradient-to-r from-blue-400 to-blue-500'
                                      : Number(pick.line?.actualValue || 0) <= Number(pick.line?.predictedValue || 0)
                                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                        : 'bg-gradient-to-r from-red-600 to-red-400'
                                    : 'bg-slate-600'
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(
                                    0,
                                    pick.line?.actualValue && pick.line?.predictedValue
                                      ? (Number(pick.line.actualValue) / (Number(pick.line.predictedValue) * 1.3)) * 100
                                      : 0,
                                  ),
                                )}%`,
                              }}
                            />
                          </div>

                          {/* Target threshold line */}
                          {pick.line?.actualValue !== null && pick.line?.predictedValue && (
                            <>
                              <div
                                className="absolute w-0.5 bg-white/80 shadow-lg"
                                style={{
                                  left: `${(Number(pick.line.predictedValue) / (Number(pick.line.predictedValue) * 1.3)) * 100}%`,
                                  top: '-1px',
                                  height: '10px',
                                }}
                              />

                              {/* Target label */}
                              <div
                                className="absolute -top-6 text-xs text-slate-300 font-medium transform -translate-x-1/2 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-600/50"
                                style={{
                                  left: `${(Number(pick.line.predictedValue) / (Number(pick.line.predictedValue) * 1.3)) * 100}%`,
                                }}
                              >
                                {pick.line.predictedValue}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
