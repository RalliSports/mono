export interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}
export default function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="sticky top-[116px] z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/30 px-4 py-3">
      <div className="flex items-center space-x-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search lobbies, sports, or hosts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-700/50 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00CED1] focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  )
}
