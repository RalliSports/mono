export type TabType =
  | 'stats'
  | 'lines'
  | 'players'
  | 'resolve-lines'
  | 'manual-resolve-lines'
  | 'resolve-games'
  | 'matchups'

interface TabNavigationProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const tabs = [
    { id: 'stats', name: 'Stat Types', icon: '📊' },
    { id: 'players', name: 'Players', icon: '👤' },
    { id: 'lines', name: 'Create Lines', icon: '📈' },
    { id: 'resolve-lines', name: 'Resolve Lines', icon: '✅' },
    { id: 'manual-resolve-lines', name: 'Manual Resolve Lines', icon: '✅' },
    { id: 'resolve-games', name: 'Resolve Games', icon: '🎮' },
    { id: 'matchups', name: 'Match Up', icon: '⚔️' },
  ]

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-3 shadow-2xl mb-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
