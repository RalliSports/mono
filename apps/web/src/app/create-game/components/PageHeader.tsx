import Link from 'next/link'

export default function PageHeader() {
  return (
    <>
      {/* Enhanced Top Navigation Bar */}
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
            <h1 className="text-xl font-bold text-white">Create Contest 🎯</h1>
          </div>

          {/* Right: Status or Info */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00CED1] rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-400">Ready to create</span>
          </div>
        </div>
      </div>

      {/* Enhanced Header Content */}
      <div className="text-center py-8 px-4">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/20 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-2xl">🎯</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00CED1] to-blue-400 bg-clip-text text-transparent mb-3">
          Create Contest
        </h1>
        <p className="text-slate-400 text-lg">Set up your betting challenge</p>
      </div>
    </>
  )
}
