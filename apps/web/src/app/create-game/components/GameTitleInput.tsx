interface GameTitleInputProps {
  title: string
  onChange: (title: string) => void
}

export default function GameTitleInput({ title, onChange }: GameTitleInputProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-[#00CED1]/50 transition-all duration-300 group">
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/10 rounded-xl flex items-center justify-center border border-[#00CED1]/30 shadow-lg">
          <span className="text-xl">✨</span>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Contest Title</h3>
          <p className="text-slate-400 text-sm">Give your contest a memorable name</p>
        </div>
      </div>
      <div className="relative">
        <input
          type="text"
          value={title}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter contest title..."
          className="w-full bg-gradient-to-br from-slate-700/80 to-slate-800/60 border-2 border-slate-600/40 rounded-xl px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-[#00CED1]/70 focus:ring-4 focus:ring-[#00CED1]/10 focus:bg-slate-700/90 transition-all duration-300 text-lg font-medium shadow-inner"
          maxLength={50}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
          {title.length}/50
        </div>
      </div>
      {title.length > 0 && (
        <div className="mt-3 p-3 bg-[#00CED1]/5 border border-[#00CED1]/20 rounded-lg">
          <p className="text-[#00CED1] text-sm font-medium">Preview: &quot;{title}&quot;</p>
        </div>
      )}
    </div>
  )
}
