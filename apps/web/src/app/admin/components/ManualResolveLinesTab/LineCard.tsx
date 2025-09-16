import Image from 'next/image'
import { LineFindAllInstance } from '@repo/server'
import { useState } from 'react'

interface LineCardProps {
  line: LineFindAllInstance & { value: number }
  resolvingLine: string | null
  setResolvingLine: (id: string | null) => void
  resolutionData: {
    actualValue: number
    resolutionReason: string
  }
  setResolutionData: (data: { actualValue: number; resolutionReason: string }) => void
  handleResolveLine: (lineId: string, actualValue: number) => Promise<void>
  addToast: (message: string, type: 'success' | 'error') => void
}

export default function LineCard({
  line,
  resolvingLine,
  setResolvingLine,
  resolutionData,
  setResolutionData,
  handleResolveLine,
  addToast,
}: LineCardProps) {
  const timeNow = new Date()
  const [loading, setLoading] = useState(false)

  return (
    <div className="bg-slate-700/30 rounded-xl p-6 hover:bg-slate-700/50 transition-colors border border-slate-600/20">
      <div className="space-y-4">
        {/* Line Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h4 className="text-white font-semibold text-lg">{line.athlete?.name}</h4>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                line.createdAt && line.createdAt > timeNow
                  ? 'bg-[#00CED1]/20 text-[#00CED1] border border-[#00CED1]/30'
                  : !!line.actualValue
                    ? 'bg-[#FFAB91]/20 text-[#FFAB91] border border-[#FFAB91]/30'
                    : 'bg-red-500/20 text-red-400 border border-red-400/30'
              }`}
            >
              {line.createdAt && line.createdAt > timeNow ? 'Pending' : !!line.actualValue ? 'Resolved' : 'Cancelled'}
            </span>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src={line.athlete?.picture || '/images/pfp-2.svg'}
                  alt={line.athlete?.name || ''}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold">{line.athlete?.name}</h4>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-slate-300">{line.athlete?.team?.name}</span>
                  <span className="text-slate-400">#{line.athlete?.jerseyNumber}</span>
                  <span className="text-slate-400">{line.athlete?.position}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Line Value</div>
            <div className="text-xl font-bold text-[#FFAB91]">{line.predictedValue}</div>
          </div>
        </div>

        {/* Line Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-800/30 rounded-lg">
          <div>
            <div className="text-sm text-slate-400">Stat Type</div>
            <div className="text-white font-semibold">{line.stat?.displayName}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Game</div>
            <div className="text-white font-semibold">
              {line.matchup?.homeTeam?.name} vs {line.matchup?.awayTeam?.name}
            </div>
          </div>
        </div>

        {/* Resolution Status or Input */}
        {!!line.actualValue && (
          <div className="p-4 bg-gradient-to-r from-[#FFAB91]/10 to-[#00CED1]/10 border border-[#FFAB91]/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-300">Resolved Value</div>
                <div className="text-lg font-bold text-[#FFAB91]">
                  {line.actualValue} (Line was {line.predictedValue})
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-300">Result</div>
                <div
                  className={`font-bold ${
                    line.actualValue! > line.predictedValue! ? 'text-[#00CED1]' : 'text-[#FFAB91]'
                  }`}
                >
                  {line.actualValue! > line.predictedValue!
                    ? 'OVER'
                    : line.actualValue! < line.predictedValue!
                      ? 'UNDER'
                      : 'PUSH'}
                </div>
              </div>
            </div>
          </div>
        )}

        {!line.actualValue && (
          <div className="border-t border-slate-600/30 pt-4">
            {resolvingLine === line.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Actual {line.stat?.displayName} Value</label>
                    <input
                      type="number"
                      step="0.1"
                      value={resolutionData.actualValue}
                      onChange={(e) =>
                        setResolutionData({
                          ...resolutionData,
                          actualValue: parseFloat(e.target.value),
                        })
                      }
                      placeholder={`e.g., ${line.predictedValue}`}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                    <div className="mt-1 text-sm text-slate-400">Line value: {line.value}</div>
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Resolution Reason (Optional)</label>
                    <input
                      type="text"
                      value={resolutionData.resolutionReason}
                      onChange={(e) =>
                        setResolutionData({
                          ...resolutionData,
                          resolutionReason: e.target.value,
                        })
                      }
                      placeholder="e.g., Official stats, injury, etc."
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={async () => {
                      const actualValue = resolutionData.actualValue
                      if (isNaN(actualValue)) {
                        addToast('Please enter a valid actual value', 'error')
                        return
                      }
                      setLoading(true)
                      await handleResolveLine(line.id, actualValue)
                      setResolvingLine(null)
                      setResolutionData({
                        actualValue: 0,
                        resolutionReason: '',
                      })
                      setLoading(false)
                    }}
                    disabled={resolutionData.actualValue < 0}
                    className="px-6 py-3 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Resolving...' : 'Auto Resolve'}
                  </button>
                  <button
                    onClick={() => {
                      handleResolveLine(line.id, 0)
                      setResolvingLine(null)
                      setResolutionData({
                        actualValue: 0,
                        resolutionReason: '',
                      })
                    }}
                    className="px-4 py-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-xl transition-colors"
                  >
                    Cancel Line
                  </button>
                  <button
                    onClick={() => {
                      setResolvingLine(null)
                      setResolutionData({
                        actualValue: 0,
                        resolutionReason: '',
                      })
                    }}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={() => setResolvingLine(line.id)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Resolve Line
                </button>
                <button
                  onClick={() => {
                    handleResolveLine(line.id, 0)
                  }}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-xl transition-colors"
                >
                  Quick Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
