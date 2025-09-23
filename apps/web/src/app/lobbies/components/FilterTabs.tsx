export interface FilterTab {
  id: string
  name: string
  icon: string
  count: number
  color: string
}

export interface FilterTabsProps {
  filterTabs: FilterTab[]
  selectedFilter: string
  onFilterChange: (filterId: string) => void
}
export default function FilterTabs({ filterTabs, selectedFilter, onFilterChange }: FilterTabsProps) {
  return (
    <div className="sticky top-[60px] z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/30 px-4 py-3">
      <div className="flex space-x-2 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
              selectedFilter === tab.id
                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
            <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">{tab.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
