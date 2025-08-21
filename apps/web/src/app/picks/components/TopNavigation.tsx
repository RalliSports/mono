import Link from 'next/link'

interface TopNavigationProps {
  gameId?: string
  selectedCount: number
  legsRequired: number
}

export default function TopNavigation({ gameId, selectedCount, legsRequired }: TopNavigationProps) {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Back Button + Title */}
        <div className="flex items-center space-x-3">
          <Link
            href={`/join-game?id=${gameId}`}
            className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-white">
            <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
              Make Your Picks
            </span>
          </h1>
        </div>

        {/* Right: Progress Info */}
        <div className="text-right">
          <div className="text-[#00CED1] font-bold text-lg">
            {selectedCount}/{legsRequired}
          </div>
          <div className="text-slate-400 text-xs">Selected</div>
        </div>
      </div>
    </div>
  )
}
