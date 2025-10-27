interface PrivateGameToggleProps {
  isPrivate: boolean
  onChange: (isPrivate: boolean) => void
}

export default function PrivateGameToggle({ isPrivate, onChange }: PrivateGameToggleProps) {
  const colorScheme = {
    hover: 'hover:border-purple-400/50',
    iconBg: 'from-purple-500/20 to-purple-400/10',
    iconBorder: 'border-purple-400/20',
    toggleBg: isPrivate ? 'bg-purple-500' : 'bg-slate-600',
    toggleTransform: isPrivate ? 'translate-x-6' : 'translate-x-1',
    statusColor: isPrivate ? 'text-purple-400' : 'text-slate-400',
  }

  return (
    <div
      className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 ${colorScheme.hover} transition-all duration-300`}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div
          className={`w-10 h-10 bg-gradient-to-br ${colorScheme.iconBg} rounded-lg flex items-center justify-center border ${colorScheme.iconBorder}`}
        >
          <span className="text-lg">🔒</span>
        </div>
        <div>
          <h3 className="text-white font-bold">Game Privacy</h3>
          <p className="text-slate-400 text-xs">Control who can join your game</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-white font-medium">{isPrivate ? 'Private Game' : 'Public Game'}</span>
          <span className="text-slate-400 text-xs">
            {isPrivate ? 'Only invited players can join' : 'Anyone can discover and join'}
          </span>
        </div>

        <button
          onClick={() => onChange(!isPrivate)}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/20 ${colorScheme.toggleBg}`}
          role="switch"
          aria-checked={isPrivate}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${colorScheme.toggleTransform}`}
          />
        </button>
      </div>

      {isPrivate && (
        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-400/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-purple-400 text-sm">💡</span>
            <p className="text-purple-300 text-xs">
              Private games can be shared via invite link. Players will need the link to join your game.
            </p>
          </div>
        </div>
      )}

      <div className="mt-3 flex justify-between text-xs">
        <span className={isPrivate ? 'text-slate-500' : 'text-slate-300'}>Public</span>
        <span className={isPrivate ? 'text-purple-400' : 'text-slate-500'}>Private</span>
      </div>
    </div>
  )
}
