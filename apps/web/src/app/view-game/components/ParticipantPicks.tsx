import Image from 'next/image'
import { Participant } from './types'

interface ParticipantPicksProps {
  participant: Participant
}

export default function ParticipantPicks({ participant }: ParticipantPicksProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300 shadow-2xl shadow-[#00CED1]/10">
      <div className="p-4 border-b border-slate-700/50">
        <h5 className="text-white font-bold truncate">{participant.user.username}'s Picks</h5>
        <p className="text-slate-400 text-sm">{participant.bets.length} legs selected</p>
      </div>

      <div className="divide-y divide-slate-700/30">
        {participant.bets.map((pick) => (
          <div key={pick.id} className="p-4 hover:bg-slate-700/20 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                  {pick.line.athleteId ? (
                    <Image
                      src={pick.line.athlete.picture}
                      alt={pick.line.athlete.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `<span class="text-white font-bold">${pick.line.athlete.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}</span>`
                        }
                      }}
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">{pick.line.athleteId}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h6 className="text-white font-semibold text-sm leading-tight truncate">{pick.line.athlete.name}</h6>
                  <p className="text-slate-400 text-xs">{new Date(pick.line.matchup.startsAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-white font-semibold text-sm">
                  {pick.line.stat.name} {pick.predictedDirection} {pick.line.predictedValue}
                </div>
                <div className="text-slate-400 text-xs">{pick.line.actualValue}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
