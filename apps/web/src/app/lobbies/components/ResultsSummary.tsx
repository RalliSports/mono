export interface ResultsSummaryProps {
  searchQuery: string
  resultCount: number
  onClearSearch: () => void
}

export default function ResultsSummary({ searchQuery, resultCount, onClearSearch }: ResultsSummaryProps) {
  if (!searchQuery) return null

  return (
    <div className="mb-6 flex items-center justify-center">
      <div className="bg-[#FFAB91]/20 border border-[#FFAB91]/30 rounded-xl px-4 py-2 flex items-center space-x-2">
        <span className="text-[#FFAB91]">🔍</span>
        <span className="text-[#FFAB91] font-semibold text-sm">
          Found {resultCount} results for &quot;{searchQuery}&quot;
        </span>
        <button onClick={onClearSearch} className="text-[#FFAB91] hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
