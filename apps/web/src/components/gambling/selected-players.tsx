import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { formatBalance } from '@/lib/utils'

export default function SelectedPlayers() {
  // Para wallet balance hook
  const { isConnected, balances, isLoading: balanceLoading, error: balanceError } = useParaWalletBalance()

  const selectedPlayers = [
    {
      id: 1,
      name: 'Patrick Mahomes',
      team: 'KC',
      position: 'QB',
      price: 2.4,
      selected: true,
      performance: '+12.5%',
      status: 'hot',
      statLine: 'Passing Yards',
      prediction: 'HIGHER',
      projectedValue: '285.5',
    },
    {
      id: 2,
      name: 'Josh Allen',
      team: 'BUF',
      position: 'QB',
      price: 2.8,
      selected: true,
      performance: '+8.3%',
      status: 'rising',
      statLine: 'Rushing Yards',
      prediction: 'HIGHER',
      projectedValue: '45.5',
    },
    {
      id: 3,
      name: 'Cooper Kupp',
      team: 'LAR',
      position: 'WR',
      price: 1.9,
      selected: 'in-progress',
      performance: '-2.1%',
      status: 'cooling',
    },
    {
      id: 4,
      name: 'Derrick Henry',
      team: 'TEN',
      position: 'RB',
      price: 2.1,
      selected: false,
      performance: '+15.7%',
      status: 'hot',
    },
  ]

  const statLineOptions = [
    'Passing Yards',
    'Rushing Yards',
    'Receiving Yards',
    'Touchdowns',
    'Receptions',
    'First Downs',
  ]

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'RB':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'WR':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'TE':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hot':
        return '🔥'
      case 'rising':
        return '📈'
      case 'cooling':
        return '❄️'
      default:
        return '📊'
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 shadow-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FFAB91] to-[#00CED1] rounded-full blur-3xl"></div>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <div className="w-12 h-12 bg-[#FFAB91]/20 rounded-xl flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-[#FFAB91]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>{' '}
          Selected Athletes
        </h3>{' '}
        <div className="flex items-center space-x-3">
          <div className="bg-[#00CED1]/20 border border-[#00CED1]/30 rounded-full px-4 py-2">
            <span className="text-[#00CED1] font-semibold text-sm">2/5 Selected</span>
          </div>
          <button className="px-4 py-2 bg-[#FFAB91]/20 border border-[#FFAB91]/30 rounded-full text-[#FFAB91] text-sm font-semibold hover:bg-[#FFAB91]/30 transition-colors">
            Add Athlete
          </button>
        </div>
      </div>{' '}
      {/* Athlete List */}
      <div className="space-y-4 relative z-10">
        {selectedPlayers.map((player) => (
          <div
            key={player.id}
            className={`group flex flex-col p-5 rounded-2xl border transition-all duration-300 hover:transform hover:scale-[1.02] ${
              player.selected === true
                ? 'bg-gradient-to-r from-[#00CED1]/10 to-[#FFAB91]/5 border-[#00CED1]/30 shadow-lg hover:border-[#00CED1]/50'
                : player.selected === 'in-progress'
                  ? 'bg-gradient-to-r from-orange-500/10 to-yellow-500/5 border-orange-500/30 shadow-lg hover:border-orange-500/50'
                  : 'bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600/50'
            }`}
          >
            {/* Main athlete info row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                      player.selected === true
                        ? 'bg-gradient-to-br from-[#00CED1] to-[#FFAB91] shadow-lg'
                        : player.selected === 'in-progress'
                          ? 'bg-gradient-to-br from-orange-500 to-yellow-500 shadow-lg'
                          : 'bg-slate-700 group-hover:bg-slate-600'
                    }`}
                  >
                    <span className="text-white font-bold text-lg">
                      {player.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  {player.selected === true && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  {player.selected === 'in-progress' && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white animate-spin" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-white font-bold text-lg">{player.name}</span>
                    <span className="text-lg">{getStatusIcon(player.status)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-300 font-medium">{player.team}</span>
                    <span className="text-slate-500">•</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPositionColor(player.position)}`}
                    >
                      {player.position}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-white font-bold text-lg">${player.price}M</div>
                  <div
                    className={`text-sm font-semibold ${
                      player.performance.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {player.performance}
                  </div>
                </div>
                <button
                  className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                    player.selected === true
                      ? 'bg-[#00CED1] border-[#00CED1] shadow-lg'
                      : player.selected === 'in-progress'
                        ? 'bg-orange-500 border-orange-500 shadow-lg'
                        : 'border-slate-600 hover:border-[#00CED1] hover:bg-[#00CED1]/20'
                  }`}
                >
                  {player.selected === true ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : player.selected === 'in-progress' ? (
                    <svg className="w-4 h-4 text-white animate-spin" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Stat line and prediction section */}
            {player.selected === true && (
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-slate-400">Stat Line:</span>
                      <span className="text-white font-semibold ml-2">{player.statLine}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-400">Projection:</span>
                      <span className="text-white font-semibold ml-2">{player.projectedValue}</span>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      player.prediction === 'HIGHER'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {player.prediction}
                  </div>
                </div>
              </div>
            )}

            {/* Dropdown selection for in-progress athletes */}
            {player.selected === 'in-progress' && (
              <div className="mt-4 pt-4 border-t border-orange-500/30">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Select Stat Line</label>
                    <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                      <option value="">Choose stat...</option>
                      {statLineOptions.map((stat) => (
                        <option key={stat} value={stat}>
                          {stat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Prediction</label>
                    <div className="flex space-x-2">
                      <button className="flex-1 py-2 px-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white hover:border-emerald-500 hover:bg-emerald-500/20 transition-colors">
                        HIGHER
                      </button>
                      <button className="flex-1 py-2 px-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white hover:border-red-500 hover:bg-red-500/20 transition-colors">
                        LOWER
                      </button>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-3 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                  Confirm Selection
                </button>
              </div>
            )}
          </div>
        ))}
      </div>{' '}
      {/* Betting Summary */}
      <div className="mt-8 p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold text-white flex items-center">
            <div className="w-8 h-8 bg-[#00CED1]/20 rounded-lg flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-[#00CED1]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            Betting Summary
          </h4>
          <div className="text-right">
            <div className="text-sm text-slate-400">Current Balance</div>
            <div className="text-xl font-bold text-white">
              {isConnected
                ? balanceLoading
                  ? 'Loading...'
                  : balanceError
                    ? 'Error'
                    : balances.ralli === 0
                      ? 'Top Up'
                      : `$${formatBalance(balances.ralli)}`
                : '$0.00'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
            <div className="text-slate-400 text-sm mb-1">Potential Bet</div>
            <div className="text-white font-bold text-xl">$50.00</div>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
            <div className="text-slate-400 text-sm mb-1">Potential Payout</div>
            <div className="text-emerald-400 font-bold text-xl">$125.00</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm">Odds Multiplier</span>
            <span className="text-white font-semibold">2.5x</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Risk Level</span>
            <span className="text-orange-400 font-medium">Moderate</span>
          </div>
        </div>

        <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-xl text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
          Place Bet
        </button>
      </div>
    </div>
  )
}
