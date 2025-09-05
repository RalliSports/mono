'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CreateGame() {
  const [gameSettings, setGameSettings] = useState({
    buyInAmount: 25,
    playerLimit: 8,
    numberOfLegs: 4,
    visibility: 'public',
  })

  const handleInputChange = (field: string, value: any) => {
    setGameSettings((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      {/* Enhanced Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Back Button + Title */}
          <div className="flex items-center space-x-3">
            <Link
              href="/main"
              className="p-2 rounded-xl bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-white">Create Contest �</h1>
          </div>

          {/* Right: Status or Info */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00CED1] rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-400">Ready to create</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-20">
        <style jsx>{`
          .slider {
            background: linear-gradient(to right, #1e293b 0%, #ffab91 50%, #ff8e53 100%);
            height: 8px;
            border-radius: 8px;
            outline: none;
            opacity: 0.9;
            transition: all 0.3s ease;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
          }

          .slider:hover {
            background: linear-gradient(to right, #334155 0%, #ff8e53 50%, #ff7043 100%);
            box-shadow:
              inset 0 2px 4px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 142, 83, 0.3);
          }

          .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffab91, #ff8e53);
            cursor: pointer;
            border: 3px solid #ffffff;
            box-shadow:
              0 4px 12px rgba(255, 171, 145, 0.4),
              0 0 0 1px rgba(255, 171, 145, 0.6);
            transition: all 0.3s ease;
          }

          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow:
              0 6px 20px rgba(255, 171, 145, 0.6),
              0 0 0 2px rgba(255, 171, 145, 0.8);
            background: linear-gradient(135deg, #ff8e53, #ff7043);
          }

          .contest-legs-slider {
            background: linear-gradient(to right, #1e293b 0%, #34d399 50%, #10b981 100%);
            height: 8px;
            border-radius: 8px;
            outline: none;
            opacity: 0.9;
            transition: all 0.3s ease;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
          }

          .contest-legs-slider:hover {
            background: linear-gradient(to right, #334155 0%, #10b981 50%, #059669 100%);
            box-shadow:
              inset 0 2px 4px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(16, 185, 129, 0.3);
          }

          .contest-legs-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #10b981, #059669);
            cursor: pointer;
            border: 3px solid #ffffff;
            box-shadow:
              0 4px 12px rgba(16, 185, 129, 0.4),
              0 0 0 1px rgba(16, 185, 129, 0.6);
            transition: all 0.3s ease;
          }

          .contest-legs-slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            background: linear-gradient(135deg, #34d399, #10b981);
            box-shadow:
              0 6px 20px rgba(16, 185, 129, 0.6),
              0 0 0 2px rgba(16, 185, 129, 0.8);
          }
        `}</style>

        <div className="max-w-md mx-auto space-y-6 pt-6">
          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/20 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-2xl">�</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00CED1] to-blue-400 bg-clip-text text-transparent mb-3">
              Create Contest
            </h1>
            <p className="text-slate-400 text-lg">Set up your betting challenge</p>
          </div>

          {/* Main Form Container */}
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-6">
            {/* Buy-in Amount */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-[#00CED1]/50 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/10 rounded-lg flex items-center justify-center border border-[#00CED1]/20">
                  <span className="text-lg">�</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">Buy-in Amount</h3>
                  <p className="text-slate-400 text-xs">Entry fee per player</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-[#00CED1] font-bold text-lg">$</span>
                <input
                  type="range"
                  value={gameSettings.buyInAmount}
                  onChange={(e) => handleInputChange('buyInAmount', parseInt(e.target.value))}
                  min="5"
                  max="500"
                  step="5"
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-[#00CED1] font-bold text-xl min-w-[3rem] text-center">
                  ${gameSettings.buyInAmount}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>$5</span>
                <span>$500</span>
              </div>
            </div>

            {/* Player Limit */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-orange-400/50 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-400/10 rounded-lg flex items-center justify-center border border-orange-400/20">
                  <span className="text-lg">�</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">Player Limit</h3>
                  <p className="text-slate-400 text-xs">Maximum participants</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <input
                  type="range"
                  value={gameSettings.playerLimit}
                  onChange={(e) => handleInputChange('playerLimit', parseInt(e.target.value))}
                  min="2"
                  max="20"
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-orange-400 font-bold text-xl min-w-[2.5rem] text-center">
                  {gameSettings.playerLimit}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>2</span>
                <span>20</span>
              </div>
            </div>

            {/* Contest Legs */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-400/50 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 rounded-lg flex items-center justify-center border border-emerald-400/20">
                  <span className="text-lg">�</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">Contest Legs</h3>
                  <p className="text-slate-400 text-xs">Required bets</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <input
                  type="range"
                  value={gameSettings.numberOfLegs}
                  onChange={(e) => handleInputChange('numberOfLegs', parseInt(e.target.value))}
                  min="3"
                  max="15"
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer contest-legs-slider"
                />
                <span className="text-emerald-400 font-bold text-xl min-w-[2.5rem] text-center">
                  {gameSettings.numberOfLegs}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>3</span>
                <span>15</span>
              </div>
            </div>

            {/* Visibility */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-purple-400/50 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-400/10 rounded-lg flex items-center justify-center border border-purple-400/20">
                  <span className="text-lg">�</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">Visibility</h3>
                  <p className="text-slate-400 text-xs">Who can join this contest</p>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => handleInputChange('visibility', 'public')}
                  className={`w-full p-3 rounded-xl border-2 transition-all duration-200 ${
                    gameSettings.visibility === 'public'
                      ? 'border-[#00CED1] bg-[#00CED1]/10 shadow-lg'
                      : 'border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">�</span>
                    <div className="text-left">
                      <div className="text-white font-semibold text-sm">Public Contest</div>
                      <div className="text-slate-400 text-xs">Anyone can join</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleInputChange('visibility', 'private')}
                  className={`w-full p-3 rounded-xl border-2 transition-all duration-200 ${
                    gameSettings.visibility === 'private'
                      ? 'border-[#00CED1] bg-[#00CED1]/10 shadow-lg'
                      : 'border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">�</span>
                    <div className="text-left">
                      <div className="text-white font-semibold text-sm">Private Contest</div>
                      <div className="text-slate-400 text-xs">Invite only</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleInputChange('visibility', 'friends')}
                  className={`w-full p-3 rounded-xl border-2 transition-all duration-200 ${
                    gameSettings.visibility === 'friends'
                      ? 'border-[#00CED1] bg-[#00CED1]/10 shadow-lg'
                      : 'border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">�</span>
                    <div className="text-left">
                      <div className="text-white font-semibold text-sm">Friends Only</div>
                      <div className="text-slate-400 text-xs">Friends can join</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Prize Pool Summary */}
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-[#00CED1]/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-lg">Contest Summary</h3>
                <p className="text-slate-400 text-sm">Total prize pool and details</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold bg-gradient-to-r from-[#00CED1] to-blue-400 bg-clip-text text-transparent">
                  ${gameSettings.buyInAmount * gameSettings.playerLimit}
                </div>
                <div className="text-xs text-slate-400">Total prize pool</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center mb-6">
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-orange-400 font-bold text-lg">{gameSettings.playerLimit}</div>
                <div className="text-slate-400 text-xs">Max Players</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-emerald-400 font-bold text-lg">{gameSettings.numberOfLegs}</div>
                <div className="text-slate-400 text-xs">Required Bets</div>
              </div>
            </div>

            <button className="relative w-full bg-gradient-to-r from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg overflow-hidden group">
              <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>�</span>
                <span>Create Contest</span>
              </span>
            </button>
          </div>

          {/* Back Navigation */}
          <div className="text-center">
            <Link
              href="/main"
              className="inline-flex items-center space-x-2 text-slate-400 hover:text-[#00CED1] transition-colors duration-200"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
