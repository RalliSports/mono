'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function HeroProfessional() {
  const [currentBetIndex, setCurrentBetIndex] = useState(0)
  const [liveCount, setLiveCount] = useState(2847)
  const [activityScrollOffset, setActivityScrollOffset] = useState(0)
  const [chartData, setChartData] = useState([45, 52, 48, 61, 70, 65, 78, 82, 75, 88, 95, 92])

  // Mock data for rotating dashboard content
  const liveBets = [
    {
      match: 'Chiefs vs Bills',
      sport: 'NFL',
      user: 'Jake M.',
      amount: '+$150',
      status: 'Leading',
      color: 'green',
    },
    {
      match: 'Lakers vs Warriors',
      sport: 'NBA',
      user: 'Sarah C.',
      amount: '$75',
      status: 'Q3 Live',
      color: 'orange',
    },
    {
      match: 'Arsenal vs Chelsea',
      sport: 'EPL',
      user: 'Mike R.',
      amount: '$100',
      status: 'Starting',
      color: 'blue',
    },
    {
      match: 'Cowboys vs Giants',
      sport: 'NFL',
      user: 'Alex K.',
      amount: '+$89',
      status: 'Won',
      color: 'green',
    },
    {
      match: 'Heat vs Celtics',
      sport: 'NBA',
      user: 'Emma L.',
      amount: '$125',
      status: 'Live',
      color: 'orange',
    },
  ]
  const recentWins = [
    '$247',
    '$156',
    '$89',
    '$312',
    '$78',
    '$445',
    '$123',
    '$267',
    '$534',
    '$92',
    '$188',
    '$376',
    '$221',
    '$99',
    '$467',
    '$143',
    '$298',
    '$67',
    '$512',
    '$184',
    '$329',
    '$458',
    '$76',
    '$234',
    '$389',
    '$145',
    '$678',
    '$203',
    '$87',
    '$356',
    '$412',
    '$129',
    '$245',
    '$567',
    '$98',
    '$423',
    '$178',
    '$301',
    '$489',
    '$156',
    '$267',
    '$334',
    '$125',
    '$478',
    '$201',
    '$89',
    '$356',
    '$412',
    '$234',
    '$567',
    '$134',
    '$298',
    '$189',
    '$445',
    '$278',
    '$367',
    '$123',
    '$489',
    '$167',
    '$334',
    '$256',
    '$398',
    '$145',
    '$567',
    '$789',
    '$234',
    '$456',
    '$123',
    '$678',
    '$345',
    '$567',
    '$189',
    '$334',
    '$567',
    '$123',
    '$445',
    '$278',
    '$389',
    '$156',
    '$423',
    '$267',
    '$534',
    '$189',
    '$367',
    '$234',
    '$578',
    '$145',
    '$356',
    '$423',
    '$189',
    '$567',
    '$234',
    '$445',
    '$178',
    '$389',
    '$267',
    '$534',
    '$123',
    '$367',
    '$245',
    '$578',
    '$156',
    '$423',
    '$289',
    '$567',
    '$134',
    '$445',
    '$278',
    '$389',
    '$167',
    '$534',
    '$245',
    '$367',
    '$189',
    '$578',
    '$234',
    '$445',
    '$156',
    '$389',
    '$278',
    '$534',
    '$167',
    '$367',
    '$245',
    '$578',
    '$189',
    '$445',
    '$234',
    '$389',
    '$156',
    '$534',
    '$278',
    '$367',
    '$167',
    '$578',
    '$245',
    '$445',
    '$189',
    '$389',
    '$234',
    '$534',
    '$156',
    '$367',
    '$278',
    '$578',
    '$167',
    '$445',
    '$245',
    '$389',
    '$189',
    '$534',
    '$234',
  ]

  // Massive activity feed for scrolling
  const activityFeed = [
    {
      user: 'Mike R.',
      action: 'won',
      amount: '$247',
      game: 'Lakers ML',
      time: '2s',
    },
    {
      user: 'Sarah K.',
      action: 'placed',
      amount: '$89',
      game: 'Chiefs -3.5',
      time: '5s',
    },
    {
      user: 'Alex T.',
      action: 'won',
      amount: '$156',
      game: 'Arsenal Win',
      time: '8s',
    },
    {
      user: 'Emma L.',
      action: 'placed',
      amount: '$123',
      game: 'Cowboys +7',
      time: '12s',
    },
    {
      user: 'Jake M.',
      action: 'won',
      amount: '$334',
      game: 'Heat ML',
      time: '15s',
    },
    {
      user: 'Lisa P.',
      action: 'placed',
      amount: '$67',
      game: 'Celtics U210',
      time: '18s',
    },
    {
      user: 'Ryan D.',
      action: 'won',
      amount: '$445',
      game: 'Warriors -5.5',
      time: '22s',
    },
    {
      user: 'Maya S.',
      action: 'placed',
      amount: '$189',
      game: 'Bills +3',
      time: '25s',
    },
    {
      user: 'Tom B.',
      action: 'won',
      amount: '$278',
      game: 'Chelsea Draw',
      time: '28s',
    },
    {
      user: 'Anna K.',
      action: 'placed',
      amount: '$234',
      game: 'Cowboys O47.5',
      time: '31s',
    },
    {
      user: 'Chris W.',
      action: 'won',
      amount: '$567',
      game: 'Lakers -4',
      time: '34s',
    },
    {
      user: 'Kelly R.',
      action: 'placed',
      amount: '$145',
      game: 'Arsenal -1',
      time: '37s',
    },
    {
      user: 'Mark L.',
      action: 'won',
      amount: '$389',
      game: 'Heat +8.5',
      time: '40s',
    },
    {
      user: 'Sophie M.',
      action: 'placed',
      amount: '$298',
      game: 'Bills U51.5',
      time: '43s',
    },
    {
      user: 'Dave N.',
      action: 'won',
      amount: '$456',
      game: 'Warriors ML',
      time: '46s',
    },
    {
      user: 'Nina T.',
      action: 'placed',
      amount: '$167',
      game: 'Chiefs -7',
      time: '49s',
    },
    {
      user: 'Paul J.',
      action: 'won',
      amount: '$623',
      game: 'Celtics +3.5',
      time: '52s',
    },
    {
      user: 'Zoe H.',
      action: 'placed',
      amount: '$134',
      game: 'Arsenal O2.5',
      time: '55s',
    },
    {
      user: 'Sam K.',
      action: 'won',
      amount: '$345',
      game: 'Lakers ML',
      time: '58s',
    },
    {
      user: 'Bella R.',
      action: 'placed',
      amount: '$289',
      game: 'Heat O108.5',
      time: '61s',
    },
    {
      user: 'Josh T.',
      action: 'won',
      amount: '$467',
      game: 'Cowboys ML',
      time: '64s',
    },
    {
      user: 'Mia L.',
      action: 'placed',
      amount: '$178',
      game: 'Bills -6',
      time: '67s',
    },
    {
      user: 'Tyler S.',
      action: 'won',
      amount: '$534',
      game: 'Warriors +2',
      time: '70s',
    },
    {
      user: 'Grace M.',
      action: 'placed',
      amount: '$223',
      game: 'Celtics ML',
      time: '73s',
    },
    {
      user: 'Ethan K.',
      action: 'won',
      amount: '$398',
      game: 'Arsenal ML',
      time: '76s',
    },
    {
      user: 'Olivia P.',
      action: 'placed',
      amount: '$156',
      game: 'Lakers U220',
      time: '79s',
    },
    {
      user: 'Noah D.',
      action: 'won',
      amount: '$445',
      game: 'Heat -3',
      time: '82s',
    },
    {
      user: 'Ava W.',
      action: 'placed',
      amount: '$267',
      game: 'Cowboys +4.5',
      time: '85s',
    },
    {
      user: 'Lucas B.',
      action: 'won',
      amount: '$356',
      game: 'Bills ML',
      time: '88s',
    },
    {
      user: 'Chloe T.',
      action: 'placed',
      amount: '$189',
      game: 'Warriors O225',
      time: '91s',
    },
  ]
  // Auto-rotate dashboard content and scroll activity feed
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBetIndex((prev) => (prev + 1) % liveBets.length)
      setLiveCount((prev) => prev + Math.floor(Math.random() * 3) - 1) // Simulate live count changes
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  // Continuous scroll for activity feed
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityScrollOffset((prev) => prev + 1)
    }, 40) // Much smoother and faster scrolling
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-[#F5F5DC] to-white min-h-screen overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        {/* Animated gradient blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00CED1]/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFAB91]/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-200"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-400"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #00CED1 1px, transparent 0)`,
              backgroundSize: '32px 32px',
            }}
          ></div>
        </div>
      </div>{' '}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center min-h-screen pt-20 pb-12">
          {/* Left side - Enhanced Content */}
          <div className="flex-1 lg:pr-12 text-center lg:text-left">
            {/* Enhanced social proof indicator */}{' '}
            <div className="inline-flex items-center bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-full px-6 py-3 mb-8 shadow-xl">
              <div className="flex -space-x-2 mr-4">
                <Image
                  src="/images/avatar-01.jpg"
                  width={28}
                  height={28}
                  className="rounded-full border-2 border-white shadow-sm"
                  alt="User"
                />
                <Image
                  src="/images/avatar-02.jpg"
                  width={28}
                  height={28}
                  className="rounded-full border-2 border-white shadow-sm"
                  alt="User"
                />
                <Image
                  src="/images/avatar-03.jpg"
                  width={28}
                  height={28}
                  className="rounded-full border-2 border-white shadow-sm"
                  alt="User"
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-30"></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00CED1] to-[#00CED1] font-bold text-base drop-shadow-sm">
                    {liveCount.toLocaleString()}
                  </span>{' '}
                  <span className="drop-shadow-sm">players online</span>
                </span>
              </div>
            </div>{' '}
            {/* Enhanced main headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8 relative">
              <span className="relative inline-block text-gray-900 drop-shadow-lg">The Future of</span>
              <br />
              <span className="relative inline-block">
                {/* Main gradient text */}
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[#00CED1] to-[#FFAB91] drop-shadow-lg">
                  Sports Betting
                </span>
                {/* Simple underline */}
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full opacity-80"></div>
              </span>
            </h1>
            {/* Enhanced subtitle */}
            <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0 drop-shadow-md">
              Join the next generation of sports betting. Challenge friends with
              <span className="font-semibold text-gray-700"> intelligent predictions</span>, track your performance, and
              compete in a<span className="font-semibold text-gray-700"> transparent, social environment</span> built
              for true sports enthusiasts.
            </p>
            {/* Enhanced key benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200/50 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Instant Payouts</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200/50 shadow-sm">
                <div className="w-2 h-2 bg-[#00CED1] rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Zero Fees</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200/50 shadow-sm">
                <div className="w-2 h-2 bg-[#FFAB91] rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Fair Play</span>
              </div>
            </div>
            {/* Enhanced CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link
                href="/signin"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Start Betting Now
                  <svg
                    className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white/80 border border-gray-300 rounded-xl shadow-sm hover:shadow-md hover:border-gray-400 hover:bg-white transition-all duration-300 backdrop-blur-sm"
              >
                Watch Demo
              </Link>
            </div>
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600">Fully Licensed</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-[#00CED1]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600">Bank-Level Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-[#FFAB91]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">24/7 Support</span>
              </div>
            </div>
          </div>{' '}
          {/* Right side - Amazing Animated Dashboard */}
          <div className="flex-1 mt-16 lg:mt-0">
            {' '}
            <div className="relative max-w-lg mx-auto">
              {/* Main dashboard card with glassmorphic design */}
              <div
                className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl drop-shadow-2xl border border-gray-700/50 overflow-hidden"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                }}
              >
                {' '}
                {/* Enhanced modern header with live activity */}
                <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 p-6 border-b border-slate-600/40 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1] to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full  border-2 border-slate-800"></div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Live Dashboard</h3>
                        <p className="text-sm text-slate-400 flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                          Real-time activity
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-400/15 text-green-400 px-4 py-2 rounded-full text-sm font-semibold border border-green-400/30 backdrop-blur-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span>LIVE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{' '}
                {/* Scrolling recent wins ticker */}
                <div className="bg-gradient-to-r from-green-500/10 to-green-400/5 border-b border-gray-600/30 py-2 overflow-hidden">
                  <div className="flex items-center">
                    <span className="text-xs text-green-400 font-semibold px-4 whitespace-nowrap">RECENT WINS:</span>
                    <div className="flex-1 overflow-hidden ml-2">
                      <div className="flex animate-marquee space-x-4">
                        {[...recentWins, ...recentWins].map((win, index) => (
                          <span key={index} className="text-xs text-green-300 font-medium whitespace-nowrap">
                            +{win}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>{' '}
                </div>{' '}
                {/* Professional Statistics & Insights Section */}
                <div className="bg-gradient-to-r from-slate-900/40 to-slate-800/30 border-y border-slate-600/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm">Market Insights</h4>
                        <p className="text-slate-400 text-xs">Live trends & analytics</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-blue-500/15 text-blue-400 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-500/30">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                      <span>TRENDING</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400">Hot Streak</span>
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      </div>
                      <div className="text-lg font-bold text-orange-400">8W</div>
                      <div className="text-xs text-slate-500">Current run</div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400">Top Sport</span>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      </div>
                      <div className="text-lg font-bold text-emerald-400">NBA</div>
                      <div className="text-xs text-slate-500">89% accuracy</div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400">Payout</span>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      </div>
                      <div className="text-lg font-bold text-cyan-400">2.4x</div>
                      <div className="text-xs text-slate-500">Avg. multiplier</div>
                    </div>
                  </div>{' '}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg p-3 border border-emerald-500/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">Hot Match Alert</p>
                          <p className="text-emerald-300 text-xs">Lakers vs Warriors - 7:30 PM</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="text-emerald-400 text-xs font-medium">Live</p>
                          <p className="text-slate-400 text-xs">2.8k betting</p>
                        </div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    {/* <div className="flex items-center justify-between bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-3 border border-orange-500/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            Community Streak
                          </p>
                          <p className="text-orange-300 text-xs">
                            Mike R. hit 12 straight wins
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="text-orange-400 text-xs font-medium">
                            🔥 12W
                          </p>
                          <p className="text-slate-400 text-xs">Record</p>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Dynamic scrolling activity feed */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-300">Live Activity</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400 font-medium">Live</span>
                        </div>
                      </div>
                      <div className="relative h-32 overflow-hidden rounded-xl bg-slate-900/20 border border-slate-700/30">
                        <div
                          className="absolute inset-0 space-y-1 p-2 transition-transform ease-linear"
                          style={{
                            transform: `translateY(-${(activityScrollOffset * 1.2) % (activityFeed.length * 32)}px)`,
                          }}
                        >
                          {[...activityFeed, ...activityFeed, ...activityFeed].map((activity, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between py-1.5 px-3 bg-slate-800/40 rounded-lg border border-slate-700/20 backdrop-blur-sm"
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${activity.action === 'won' ? 'bg-green-400' : 'bg-cyan-400'}`}
                                ></div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs text-white font-medium truncate">
                                    <span className="text-slate-300">{activity.user}</span>{' '}
                                    {activity.action === 'won' ? 'won' : 'bet'}{' '}
                                    <span className={activity.action === 'won' ? 'text-green-400' : 'text-cyan-400'}>
                                      {activity.amount}
                                    </span>
                                  </p>
                                  <p className="text-xs text-slate-500 truncate">{activity.game}</p>
                                </div>
                              </div>
                              <span className="text-xs text-slate-400 flex-shrink-0">{activity.time}</span>
                            </div>
                          ))}
                        </div>
                        {/* Smooth fade gradients */}
                        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-900/60 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                </div>{' '}
                {/* Clean professional performance section */}
                <div className="px-6 pb-6">
                  <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/40 backdrop-blur-sm rounded-2xl border border-slate-600/40 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-lg">Performance</h4>
                          <p className="text-slate-400 text-sm">Weekly summary</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 bg-emerald-500/15 text-emerald-400 px-3 py-2 rounded-full text-sm font-semibold border border-emerald-500/30">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span>Active</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                          +$1,247
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Total Winnings</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-400">78%</p>
                        <p className="text-xs text-slate-400 mt-1">Win Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-cyan-400">24</p>
                        <p className="text-xs text-slate-400 mt-1">Bets Placed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced floating stats with animations */}
              {/* <div className="absolute -top-6 -right-6 bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-xl border border-gray-700/50 p-4 animate-float">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-3 h-3 text-yellow-400 animate-twinkle"
                        style={{ animationDelay: `${i * 0.2}s` }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-2xl font-bold text-white">4.9</p>
                  <p className="text-xs text-gray-400">User Rating</p>
                </div>
              </div> */}

              <div className="absolute -bottom-6 -left-6 bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-xl border border-gray-700/50 p-4 animate-float-delayed">
                <div className="text-center">
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00CED1] to-[#FFAB91]">
                    180K+
                  </p>
                  <p className="text-xs text-gray-400">Active Players</p>
                  <div className="mt-1 w-full bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] h-1 rounded-full animate-progress"
                      style={{ width: '78%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 78%;
          }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 1.5s;
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        .animate-progress {
          animation: progress 2s ease-out;
        }
      `}</style>
    </section>
  )
}

//man this shit was depressing to make if someone makes this better please do i give up on this wanna be ass dashboard ass design i saw in some randomass dogshit website from 2019 or smth
