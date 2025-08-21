import Link from 'next/link'

export default function PageHeader() {
  return (
    <>
      {/* Top Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Link
          href="/main"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-emerald-400 transition-colors duration-200 group"
        >
          <svg
            className="h-5 w-5 transition-transform group-hover:translate-x-[-2px]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back to Main</span>
        </Link>
      </div>

      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-2xl">💰</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-3">
          Add Funds
        </h1>
        <p className="text-slate-400 text-lg">Top up your account balance</p>
      </div>
    </>
  )
}
