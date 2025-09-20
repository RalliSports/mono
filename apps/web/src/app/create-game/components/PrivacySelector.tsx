interface PrivacySelectorProps {
  isPrivate: boolean
  onChange: (isPrivate: boolean) => void
}

export default function PrivacySelector({ isPrivate, onChange }: PrivacySelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <span className="text-lg">🔒</span>
        <div>
          <h3 className="text-white font-semibold text-lg">Game Privacy</h3>
          <p className="text-slate-400 text-sm">Control who can join your game</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
            !isPrivate
              ? 'border-[#00CED1] bg-[#00CED1]/10 text-white'
              : 'border-slate-600 bg-slate-800/50 text-slate-400 hover:border-slate-500'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-xl">🌍</span>
            <span className="font-semibold">Public</span>
            <span className="text-xs text-center">Anyone can find and join</span>
          </div>
          {!isPrivate && (
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-[#00CED1] rounded-full"></div>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => onChange(true)}
          className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
            isPrivate
              ? 'border-[#00CED1] bg-[#00CED1]/10 text-white'
              : 'border-slate-600 bg-slate-800/50 text-slate-400 hover:border-slate-500'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-xl">🔐</span>
            <span className="font-semibold">Private</span>
            <span className="text-xs text-center">Requires game code to join</span>
          </div>
          {isPrivate && (
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-[#00CED1] rounded-full"></div>
            </div>
          )}
        </button>
      </div>

      {isPrivate && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-500 text-sm">💡</span>
            <div className="text-yellow-500 text-sm">
              <strong>Private Game:</strong> A unique game code will be generated. Share the link to invite players.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
