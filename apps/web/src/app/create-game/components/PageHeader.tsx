import Link from 'next/link'

export default function PageHeader() {
  return (
    <>
      {/* Back Button Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/main"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-[#00CED1] transition-all duration-200 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-slate-700/60 to-slate-800/60 backdrop-blur-sm border border-slate-600/40 rounded-lg flex items-center justify-center group-hover:border-[#00CED1]/50 transition-all duration-200">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Enhanced Header */}
      <div className="text-center mb-8">
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
