import Link from 'next/link'

export default function BackNavigation() {
  return (
    <div className="text-center">
      <Link
        href="/main"
        className="inline-flex items-center space-x-2 text-slate-400 hover:text-emerald-400 transition-colors duration-200"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm">Back to Home</span>
      </Link>
    </div>
  )
}
