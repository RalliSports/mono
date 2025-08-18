import type { TabNavigationProps } from './types'

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-2 shadow-2xl">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setActiveTab('create')}
          className={`py-3 px-4 rounded-xl transition-all duration-200 font-semibold ${
            activeTab === 'create'
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Create Code
        </button>
        <button
          onClick={() => setActiveTab('enter')}
          className={`py-3 px-4 rounded-xl transition-all duration-200 font-semibold ${
            activeTab === 'enter'
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Enter Code
        </button>
      </div>
    </div>
  )
}
