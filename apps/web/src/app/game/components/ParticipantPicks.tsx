import Image from 'next/image'
import { GamesServiceFindOne } from '@repo/server'
import { capitalize, getShortenedPosition } from '@/lib/utils'

interface ParticipantPicksProps {
  participant: GamesServiceFindOne['participants'][number]
}

export default function ParticipantPicks({ participant }: ParticipantPicksProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300 shadow-2xl shadow-[#00CED1]/10">
      <div className="p-4 border-b border-slate-700/50">
        <h5 className="text-white font-bold truncate">{participant.user?.username || 'Anonymous User'}&apos;s Picks</h5>
        <p className="text-slate-400 text-sm">{participant.bets.length} legs selected</p>
      </div>

      <div className="divide-y divide-slate-700/30">
        {participant.bets.map((pick) => {
          const valueToUse = pick.line?.status === 'resolved' ? pick.line?.actualValue : pick.line?.currentValue
          console.log(valueToUse)
          const predictedValue = pick.line?.predictedValue
          const largerValue =
            Number(predictedValue!) > Number(valueToUse!) ? Number(predictedValue!) : Number(valueToUse!)
          console.log(largerValue)
          return (
            <div key={pick.id} className={`p-4 hover:bg-slate-700/20 transition-all duration-200 relative`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 backdrop-blur-lg rounded-lg flex items-center justify-center overflow-hidden transition-all duration-300 border ${
                      pick.line?.status === 'resolved'
                        ? pick.isCorrect
                          ? 'bg-emerald-500/10 shadow-emerald-500/20 shadow-lg border-emerald-500/40'
                          : 'bg-red-500/10 shadow-red-500/20 shadow-lg border-red-500/40'
                        : pick.line?.status === 'locked'
                          ? 'bg-blue-500/10 shadow-blue-500/20 shadow-lg border-blue-500/40'
                          : 'bg-white/5 border-white/20'
                    }`}
                  >
                    {pick.line?.athleteId ? (
                      <Image
                        src={pick.line?.athlete?.picture || '/images/pfp-2.svg'}
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
                            parent.innerHTML = `<span class="text-white font-bold">${
                              pick.line?.athlete?.name ||
                              ''
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                            }</span>`
                          }
                        }}
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">{pick.line?.athleteId}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h6 className="text-white font-semibold text-sm leading-tight truncate flex items-end gap-1">
                      {pick.line?.athlete?.name || ''}{' '}
                      <div className="text-slate-400 text-xs">
                        {' '}
                        {getShortenedPosition(pick.line?.athlete?.position || '')} ({pick.line?.athlete?.jerseyNumber})
                      </div>
                    </h6>
                    <p className="text-slate-400 text-xs">
                      {pick.line?.athlete?.team?.abbreviation}{' '}
                      {pick.line?.matchup?.homeTeamId === pick.line?.athlete?.team?.id ? 'vs' : '@'}{' '}
                      {pick.line?.matchup?.homeTeamId === pick.line?.athlete?.team?.id
                        ? pick.line?.matchup?.awayTeam?.abbreviation
                        : pick.line?.matchup?.homeTeam?.abbreviation}{' '}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {new Date(pick.line?.matchup?.startsAt || '').toLocaleString('en-US', {
                        weekday: 'short',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}{' '}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-semibold text-sm ${
                      pick.predictedDirection === 'under'
                        ? 'text-red-400'
                        : pick.predictedDirection === 'over'
                          ? 'text-green-400'
                          : 'text-white'
                    }`}
                  >
                    {capitalize(pick.predictedDirection!)} {pick.line?.predictedValue}
                  </div>
                  <div className="text-white font-semibold text-xs">{pick.line?.stat?.displayName || ''}</div>

                  {pick.line?.status !== 'open' && (
                    <div className="text-slate-400 text-xs">
                      {pick.line?.status === 'resolved'
                        ? `Final: ${pick.line?.currentValue}`
                        : `Current: ${pick.line?.currentValue}`}
                    </div>
                  )}

                  {/* Result indicator - game stats style box */}
                  {pick.line?.status === 'resolved' && (
                    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-lg px-1.5 py-0.5 mt-1.5 shadow-lg">
                      <div className="text-center">
                        <div
                          className={`flex items-center justify-center gap-0.5 text-[10px] font-medium ${
                            pick.isCorrect ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {pick.isCorrect ? (
                            <>
                              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              CORRECT
                            </>
                          ) : (
                            <>
                              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              INCORRECT
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2 mt-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-slate-300">
                    {pick.line?.actualValue || 0} / {pick.line?.predictedValue}
                  </span>
                </div>

                {/* Enhanced Progress Bar with Target Line */}
                {pick.line?.status !== 'open' && valueToUse !== null && (
                  <div className="relative">
                    <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          pick.line?.status === 'resolved'
                            ? pick.isCorrect
                              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                              : 'bg-gradient-to-r from-red-600 to-red-400'
                            : 'bg-gradient-to-r from-blue-400 to-blue-500'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              valueToUse && pick.line?.predictedValue
                                ? (Number(valueToUse) / (largerValue * 1.3)) * 100
                                : 0,
                            ),
                          )}%`,
                        }}
                      />
                    </div>

                    {/* Target threshold line */}
                    {valueToUse !== null && pick.line?.predictedValue && (
                      <>
                        <div
                          className="absolute w-0.5 bg-white/80 shadow-lg"
                          style={{
                            left: `${(Number(pick.line.predictedValue) / (largerValue * 1.3)) * 100}%`,
                            top: '-1px',
                            height: '10px',
                          }}
                        />

                        {/* Target label */}
                        <div
                          className="absolute -top-6 text-xs text-slate-300 font-medium transform -translate-x-1/2 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-600/50"
                          style={{
                            left: `${(Number(pick.line.predictedValue) / (largerValue * 1.3)) * 100}%`,
                          }}
                        >
                          {pick.line.predictedValue}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
