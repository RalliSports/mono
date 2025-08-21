import Link from 'next/link'

export default function GameNavigation() {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Back Button + Title */}
        <div className="flex items-center space-x-3">
          <Link
            href="/main"
            className="p-2 rounded-xl bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105 shadow-xl"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-white">Join Game 🎮</h1>
        </div>
      </div>
    </div>
  )
}
