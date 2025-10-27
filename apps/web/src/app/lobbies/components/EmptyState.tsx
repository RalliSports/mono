export interface EmptyStateProps {
  searchQuery: string
  selectedFilter: string
  onClearSearch: () => void
  onCreateGame: () => void
}

export default function EmptyState({ searchQuery, selectedFilter, onClearSearch, onCreateGame }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No lobbies found</h3>
      <p className="text-slate-400 mb-6">
        {searchQuery
          ? `No lobbies match your search for "${searchQuery}"`
          : `No lobbies found for the ${selectedFilter} filter`}
      </p>
      {searchQuery ? (
        <button
          onClick={onClearSearch}
          className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
        >
          Clear Search
        </button>
      ) : (
        <button
          onClick={onCreateGame}
          className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
        >
          Create Your First Lobby
        </button>
      )}
    </div>
  )
}
