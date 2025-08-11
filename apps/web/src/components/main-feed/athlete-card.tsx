/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'

interface AthleteCardProps {
  id: string
  name: string
  team: string
  avatar: string
  matchup: {
    id: string
    homeTeam: string
    awayTeam: string
    gameDate: Date
    status: string
    scoreHome: number
    scoreAway: number
    createdAt: Date
  }
  stats: Array<{
    type: string
    line: number
    over: string
    under: string
  }>
  isBookmarked: boolean
  isSelected: boolean
  isInSelectionMode: boolean
  onBookmarkToggle: (athleteId: string) => void
  onSelectionToggle: (athleteId: string) => void
  onProfileClick: (athleteId: string) => void
}

export default function AthleteCard({
  id,
  name,
  team,
  avatar,
  stats,
  matchup,
  isBookmarked,
  isSelected,
  isInSelectionMode,
  onBookmarkToggle,
  onSelectionToggle,
  onProfileClick,
}: AthleteCardProps) {
  const [currentStatIndex, setCurrentStatIndex] = useState(0)

  const nextStat = () => {
    setCurrentStatIndex((prev) => (prev + 1) % stats.length)
  }

  const prevStat = () => {
    setCurrentStatIndex((prev) => (prev === 0 ? stats.length - 1 : prev - 1))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    ;(e.target as any).startX = touch.clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    const startX = (e.target as any).startX
    const endX = touch.clientX
    const diff = startX - endX

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextStat()
      } else {
        prevStat()
      }
    }
  }

  const currentStat = stats[currentStatIndex]

  return (
    <div className="group relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-slate-600/60 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00CED1]/3 via-transparent to-[#FFAB91]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Selection Overlay */}
      {isInSelectionMode && (
        <button
          onClick={() => onSelectionToggle(id)}
          className={`absolute inset-0 z-10 rounded-xl border-2 transition-all duration-300 ${
            isSelected ? 'border-[#00CED1] bg-[#00CED1]/10' : 'border-transparent hover:border-[#00CED1]/50'
          }`}
        >
          {isSelected && (
            <div className="absolute top-2 left-2 w-6 h-6 bg-[#00CED1] rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </button>
      )}

      <div className="relative z-10 p-5">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            {/* Player Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-14 h-14 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:border-white/40 transition-all duration-200"
                onClick={() => onProfileClick?.(id)}
              >
                {name ? (
                  <img
                    src={`/players/${name.toLowerCase().replace(/\s+/g, '-')}.png`}
                    alt={name}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=128`
                    }}
                  />
                ) : (
                  <span className="text-white font-bold text-lg tracking-tight">{avatar}</span>
                )}
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 bg-emerald-500"></div>
            </div>

            {/* Player Details */}
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-bold text-lg mb-1 truncate">{name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-slate-300 font-semibold text-sm">{team}</span>
                <div className="text-slate-400 font-medium text-sm">
                  {matchup.homeTeam} vs {matchup.awayTeam}
                </div>
              </div>
            </div>
          </div>

          {/* Star Bookmark Button */}
          <button
            onClick={() => onBookmarkToggle(id)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isBookmarked
                ? 'text-[#FFAB91] bg-[#FFAB91]/20 border border-[#FFAB91]/40'
                : 'text-slate-400 bg-slate-700/50 border border-slate-600/50 hover:text-[#FFAB91] hover:bg-[#FFAB91]/10 hover:border-[#FFAB91]/30'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={isBookmarked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        </div>

        {/* Horizontal Layout with Stats and Buttons */}
        <div className="flex items-center gap-4">
          {/* Stats Section */}
          <div
            className="flex-1 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5 cursor-pointer touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Stat Navigation Header */}
            <div className="flex flex-col mb-3">
              <div className="text-slate-200 font-bold text-base mb-3 tracking-wide text-center">
                {currentStat.type}
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
                  {currentStat.line}
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
              {stats.map((_, index) => (
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
            <button className="bg-gradient-to-r from-emerald-500/25 to-emerald-600/15 border-2 border-emerald-400/40 rounded-xl py-2 px-4 hover:from-emerald-500/35 hover:to-emerald-600/25 hover:border-emerald-400/60 transition-all duration-300 group shadow-lg hover:shadow-emerald-500/20">
              <div className="flex items-center justify-center mb-1">
                <svg
                  className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                </svg>
              </div>
              <div className="text-emerald-300 font-bold text-sm group-hover:text-emerald-200 transition-colors">
                OVER
              </div>
            </button>

            <button className="bg-gradient-to-r from-red-500/25 to-red-600/15 border-2 border-red-400/40 rounded-xl py-2 px-4 hover:from-red-500/35 hover:to-red-600/25 hover:border-red-400/60 transition-all duration-300 group shadow-lg hover:shadow-red-500/20">
              <div className="flex items-center justify-center mb-1">
                <svg
                  className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="text-red-300 font-bold text-sm group-hover:text-red-200 transition-colors">UNDER</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
