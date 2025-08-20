import { FILTER_OPTIONS } from '../constants/filters'

interface FilterBarProps {
  onSearchClick?: () => void
}

export default function FilterBar({ onSearchClick }: FilterBarProps) {
  return (
    <div className="sticky top-[16px] z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/30 px-4 py-3">
      <div className="flex items-center space-x-3">
        {/* Search Icon */}
        <button
          onClick={onSearchClick}
          className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
        >
          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* Filter Tabs */}
        <div
          className="flex space-x-2 overflow-x-auto flex-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all duration-200 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50"
            >
              <span>{filter}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
