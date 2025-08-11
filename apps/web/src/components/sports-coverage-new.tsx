'use client'

import { useState } from 'react'
import Image from 'next/image'
// SVG logo imports removed; use string paths instead

interface LiveMatch {
  sport: string
  match: string
  league: string
  status: string
  bet1: { name: string; option: string; amount: string }
  bet2: { name: string; option: string; amount: string }
  prize: string
}

export default function SportsCoverage() {
  const [selectedAmounts, setSelectedAmounts] = useState<{
    [key: number]: number
  }>({})

  const updateBetAmount = (matchIndex: number, amount: number) => {
    setSelectedAmounts((prev) => ({
      ...prev,
      [matchIndex]: amount,
    }))
  }

  const sports = [
    {
      name: 'NBA',
      logo: '/images/nba-6.svg',
      description: 'Basketball',
      width: 32,
      height: 30,
    },
    {
      name: 'Formula 1',
      logo: '/images/F1.svg',
      description: 'Racing',
      width: 44,
      height: 48,
    },
    {
      name: 'IPL',
      logo: '/images/IPL.svg',
      description: 'Cricket',
      width: 48,
      height: 48,
    },
    {
      name: 'Boxing',
      logo: '/images/boxing.svg',
      description: 'Combat Sports',
      width: 36,
      height: 36,
    },
    {
      name: 'WBC',
      logo: '/images/WBC_logo.svg',
      description: 'Baseball',
      width: 40,
      height: 48,
    },
    {
      name: 'Olympics',
      logo: '/images/olympics-1.svg',
      description: 'Multi-Sport',
      width: 44,
      height: 44,
    },
  ]

  const liveMatches: LiveMatch[] = [
    {
      sport: 'NFL',
      match: 'Chiefs vs Bills',
      league: 'Divisional Championship',
      status: 'Live',
      bet1: { name: 'Jake M.', option: 'Chiefs -3.5', amount: '$75' },
      bet2: { name: 'Sarah C.', option: 'Bills +3.5', amount: '$75' },
      prize: '$150',
    },
    {
      sport: 'NBA',
      match: 'Lakers vs Warriors',
      league: 'Western Conference',
      status: 'Q3',
      bet1: { name: 'Mike R.', option: 'Over 225.5', amount: '$100' },
      bet2: { name: 'Open', option: 'Under 225.5', amount: '-' },
      prize: '$200',
    },
    {
      sport: 'Soccer',
      match: 'Arsenal vs Chelsea',
      league: 'Premier League',
      status: 'Live',
      bet1: { name: 'Alex K.', option: 'Arsenal Win', amount: '$60' },
      bet2: { name: 'Open', option: 'Chelsea Win', amount: '-' },
      prize: '$120',
    },
  ]
  return (
    <section className="py-24 bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gray-800 border border-gray-700 rounded-full px-6 py-3 mb-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Comprehensive Sports Coverage
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Every Sport.{' '}
            <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
              Every League.
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From major professional leagues to international competitions, challenge friends across all the sports that
            matter most.
          </p>
        </div>{' '}
        {/* Sports Grid */}
        <div className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sports.map((sport, index) => (
              <div
                key={sport.name}
                className="group relative bg-gray-800/50 rounded-2xl p-6 shadow-sm border border-gray-700 hover:shadow-xl hover:border-gray-600 hover:bg-gray-800/70 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-16 h-16 bg-gray-700/50 rounded-xl flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                    <Image
                      src={sport.logo}
                      width={sport.width}
                      height={sport.height}
                      alt={sport.name}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-white mb-1">{sport.name}</h3>
                    <p className="text-sm text-gray-400">{sport.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>{' '}
        {/* Live Betting Section */}
        <div className="mb-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-6 py-3 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-400 uppercase tracking-wide">
                Live Betting Activity
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Active{' '}
              <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                Challenges
              </span>
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              See what your friends are betting on and join the action with your own predictions.
            </p>
          </div>

          {/* Simplified Live Matches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {liveMatches.map((match, index) => {
              const betAmount = selectedAmounts[index] || 50
              const potentialPayout = Math.round(betAmount * 1.9)

              return (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-2xl p-6 shadow-lg border border-gray-700 hover:shadow-xl hover:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm"
                >
                  {/* Match Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-semibold text-white text-lg mb-1">{match.match}</h4>
                      <p className="text-sm text-gray-400">{match.league}</p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        match.status === 'Live'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}
                    >
                      {match.status}
                    </div>
                  </div>{' '}
                  {/* Current Bets */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 bg-[#00CED1]/10 rounded-lg border border-[#00CED1]/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#00CED1] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {match.bet1.name.split(' ')[0][0]}
                        </div>
                        <span className="font-medium text-white">{match.bet1.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-[#00CED1]">{match.bet1.option}</div>
                        <div className="text-sm text-gray-400">{match.bet1.amount}</div>
                      </div>
                    </div>

                    <div className="text-center py-2">
                      <span className="text-xs text-gray-500 font-medium">VS</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {match.bet2.name === 'Open' ? '?' : match.bet2.name.split(' ')[0][0]}
                        </div>
                        <span className="font-medium text-gray-300">
                          {match.bet2.name === 'Open' ? 'Open Spot' : match.bet2.name}
                        </span>{' '}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-400">{match.bet2.option}</div>
                        <div className="text-sm text-gray-500">{match.bet2.amount}</div>
                      </div>
                    </div>
                  </div>
                  {/* Quick Bet Section */}
                  <div className="bg-gradient-to-r from-[#00CED1]/10 to-[#FFAB91]/10 rounded-xl p-4 mb-4 border border-[#00CED1]/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-300">Your Bet</span>
                      <span className="text-sm font-bold text-[#00CED1]">${potentialPayout} payout</span>
                    </div>
                    <div className="flex space-x-2 mb-3">
                      {[25, 50, 100, 200].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => updateBetAmount(index, amount)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            betAmount === amount
                              ? 'bg-[#00CED1] text-white'
                              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600'
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>{' '}
                    <input
                      type="range"
                      min="10"
                      max="500"
                      value={betAmount}
                      onChange={(e) => updateBetAmount(index, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>$10</span>
                      <span className="font-medium text-[#00CED1]">${betAmount}</span>
                      <span>$500</span>
                    </div>
                  </div>
                  {/* Action Button */}
                  <button
                    className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                    onClick={() => alert(`Bet placed: $${betAmount} → Potential payout: $${potentialPayout}`)}
                  >
                    Counter Bet ${betAmount}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
        {/* Bottom CTA */}
        <div className="text-center">
          {/* <div className="inline-flex items-center space-x-2 bg-[#00CED1]/20 border border-[#00CED1]/30 rounded-full px-6 py-3 mb-6">
            <span className="text-sm font-semibold text-[#00CED1]">
              Ready to start betting?
            </span>
          </div> */}
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
            Create Your First Challenge
          </button>
        </div>
      </div>{' '}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #00ced1;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          border: 2px solid white;
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #00ced1;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .slider::-webkit-slider-track {
          background: #374151;
          border-radius: 10px;
        }
      `}</style>
    </section>
  )
}
