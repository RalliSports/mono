import { GameTabType } from '../hooks/useGameTabs'

interface TabNavigationProps {
  activeTab: GameTabType
  setActiveTab: (tab: GameTabType) => void
  isUserInGame: boolean
}

export default function TabNavigation({ activeTab, setActiveTab, isUserInGame }: TabNavigationProps) {
  const tabs = [
    { id: 'parlays', name: 'Parlays', icon: '🎯' },
    { id: 'invite-friends', name: 'Invite Friends', icon: '👥' },
    { id: 'chats', name: 'Chat', icon: '💬' },
    // { id: 'friends', name: 'Friends', icon: '👥' },
    // { id: 'history', name: 'History', icon: '📋' },
    // { id: 'achievements', name: 'Achievements', icon: '🏆' },
  ]

  if (!isUserInGame) {
    tabs.splice(2, 1) // Remove chats tab when not in game
  }

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-3 shadow-2xl mb-6">
      <div className="flex  gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as GameTabType)
            }}
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
