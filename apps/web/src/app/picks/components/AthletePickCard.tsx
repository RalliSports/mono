import { useState } from 'react'
import Image from 'next/image'
import type { Athlete, SelectedPick } from './types'

interface AthletePickCardProps {
  athlete: Athlete
  onPickSelection: (athleteId: string, statIndex: number, betType: 'over' | 'under') => void
  selectedPick?: SelectedPick
  isSelectionDisabled: boolean
}

export default function AthletePickCard({
  athlete,
  onPickSelection,
  selectedPick,
  isSelectionDisabled,
}: AthletePickCardProps) {
  const [currentStatIndex, setCurrentStatIndex] = useState(0)

  const nextStat = () => {
    setCurrentStatIndex((prev) => (prev + 1) % athlete.lines.length)
  }

  const prevStat = () => {
    setCurrentStatIndex((prev) => (prev === 0 ? athlete.lines.length - 1 : prev - 1))
  }

  const currentLine = athlete.lines[currentStatIndex]
  const currentStat = currentLine.stat
  const isThisStatSelected = selectedPick && selectedPick.lineId === currentLine.id

  return (
    <div
      className={`group relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-xl border shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
        selectedPick ? 'border-[#00CED1] shadow-[#00CED1]/20' : 'border-slate-700/50 hover:border-slate-600/60'
      }`}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00CED1]/3 via-transparent to-[#FFAB91]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 p-5">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            {/* Player Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-lg">
                {athlete.picture && athlete.picture !== '' ? (
                  <Image
                    src={athlete.picture}
                    alt={athlete.name}
                    className="w-12 h-12 object-cover rounded-lg"
                    width={48}
                    height={48}
                  />
                ) : null}
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 bg-emerald-500"></div>
            </div>

            {/* Player Details */}
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-bold text-lg mb-1 truncate">{athlete.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-slate-300 font-semibold text-sm">{athlete.team}</span>
                <div className="text-slate-400 font-medium text-sm">
                  {athlete.lines[currentStatIndex].matchup.homeTeam.abbreviation} vs{' '}
                  {athlete.lines[currentStatIndex].matchup.awayTeam.abbreviation}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Layout with Stats and Buttons */}
        <div className="flex items-center gap-4">
          {/* Stats Section */}
          <div className="flex-1 min-w-0 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5">
            {/* Stat Navigation Header */}
            <div className="flex flex-col mb-3">
              <div
                className="text-slate-200 font-bold text-base mb-3 tracking-wide text-center px-1 max-h-12 overflow-hidden flex items-center justify-center"
                title={currentStat.name}
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.2rem',
                }}
              >
                {currentStat.name}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={prevStat}
                  className="w-8 h-8 bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-[#00CED1]/30 hover:to-[#00CED1]/20 rounded-lg flex items-center justify-center transition-all duration-300 border border-slate-600/40 hover:border-[#00CED1]/50"
                >
                  <svg
                    className="w-4 h-4 text-slate-300 hover:text-[#00CED1] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="text-[#00CED1] font-black text-3xl tracking-tight drop-shadow-lg">
                  {currentLine.predictedValue}
                </div>

                <button
                  onClick={nextStat}
                  className="w-8 h-8 bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-[#00CED1]/30 hover:to-[#00CED1]/20 rounded-lg flex items-center justify-center transition-all duration-300 border border-slate-600/40 hover:border-[#00CED1]/50"
                >
                  <svg
                    className="w-4 h-4 text-slate-300 hover:text-[#00CED1] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center space-x-2">
              {athlete.lines.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStatIndex(index)}
                  className={`transition-all duration-500 rounded-full ${
                    index === currentStatIndex
                      ? 'w-6 h-1.5 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] shadow-lg shadow-[#00CED1]/30'
                      : 'w-1.5 h-1.5 bg-slate-600/60 hover:bg-slate-500/80 hover:scale-150 shadow-md'
                  }`}
                ></button>
              ))}
            </div>
          </div>

          {/* Over/Under Buttons */}
          <div className="flex flex-col space-y-2 min-w-[100px] flex-shrink-0">
            <button
              onClick={() => onPickSelection(athlete.id, currentStatIndex, 'over')}
              disabled={isSelectionDisabled}
              className={`rounded-xl py-2 px-4 transition-all duration-300 group shadow-lg ${
                isThisStatSelected && selectedPick?.predictedDirection === 'over'
                  ? 'bg-gradient-to-r from-emerald-500/50 to-emerald-600/40 border-2 border-emerald-300 shadow-emerald-500/40'
                  : isSelectionDisabled
                    ? 'bg-gradient-to-r from-slate-600/25 to-slate-700/15 border-2 border-slate-500/20 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-emerald-500/25 to-emerald-600/15 border-2 border-emerald-400/40 hover:from-emerald-500/35 hover:to-emerald-600/25 hover:border-emerald-400/60 hover:shadow-emerald-500/20'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isThisStatSelected && selectedPick?.predictedDirection === 'over'
                      ? 'text-emerald-300 scale-110'
                      : isSelectionDisabled
                        ? 'text-slate-500'
                        : 'text-emerald-400 group-hover:scale-110'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                </svg>
              </div>
              <div
                className={`font-bold text-sm transition-colors ${
                  isThisStatSelected && selectedPick?.predictedDirection === 'over'
                    ? 'text-emerald-200'
                    : isSelectionDisabled
                      ? 'text-slate-500'
                      : 'text-emerald-300 group-hover:text-emerald-200'
                }`}
              >
                OVER
              </div>
            </button>

            <button
              onClick={() => onPickSelection(athlete.id, currentStatIndex, 'under')}
              disabled={isSelectionDisabled}
              className={`rounded-xl py-2 px-4 transition-all duration-300 group shadow-lg ${
                isThisStatSelected && selectedPick?.predictedDirection === 'under'
                  ? 'bg-gradient-to-r from-red-500/50 to-red-600/40 border-2 border-red-300 shadow-red-500/40'
                  : isSelectionDisabled
                    ? 'bg-gradient-to-r from-slate-600/25 to-slate-700/15 border-2 border-slate-500/20 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-red-500/25 to-red-600/15 border-2 border-red-400/40 hover:from-red-500/35 hover:to-red-600/25 hover:border-red-400/60 hover:shadow-red-500/20'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isThisStatSelected && selectedPick?.predictedDirection === 'under'
                      ? 'text-red-300 scale-110'
                      : isSelectionDisabled
                        ? 'text-slate-500'
                        : 'text-red-400 group-hover:scale-110'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div
                className={`font-bold text-sm transition-colors ${
                  isThisStatSelected && selectedPick?.predictedDirection === 'under'
                    ? 'text-red-200'
                    : isSelectionDisabled
                      ? 'text-slate-500'
                      : 'text-red-300 group-hover:text-red-200'
                }`}
              >
                UNDER
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
