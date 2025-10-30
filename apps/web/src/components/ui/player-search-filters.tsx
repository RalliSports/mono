'use client'

import { useState } from 'react'
import { SearchBar } from './searchbar'
import { MultiSelectFilter } from './multi-select-filter'
import { Filter, X } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface PlayerFilters {
  search: string
  teams: string[]
  positions: string[]
  statTypes: string[]
}

interface PlayerSearchFiltersProps {
  filters: PlayerFilters
  onFiltersChange: (filters: PlayerFilters) => void
  teamOptions: FilterOption[]
  positionOptions: FilterOption[]
  statTypeOptions: FilterOption[]
  className?: string
}

export function PlayerSearchFilters({
  filters,
  onFiltersChange,
  teamOptions,
  positionOptions,
  statTypeOptions,
  className = '',
}: PlayerSearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters = filters.teams.length > 0 || filters.positions.length > 0 || filters.statTypes.length > 0

  const clearAllFilters = () => {
    onFiltersChange({
      search: filters.search,
      teams: [],
      positions: [],
      statTypes: [],
    })
  }

  const updateFilters = (key: keyof PlayerFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <SearchBar
        searchTerm={filters.search}
        setSearchTerm={(value) => updateFilters('search', value)}
        extraContainerClass="px-0"
        placeholder="Search players by name..."
      />

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white hover:border-slate-600 transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-[#00CED1] text-black text-xs rounded-full">
              {filters.teams.length + filters.positions.length + filters.statTypes.length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button onClick={clearAllFilters} className="flex items-center gap-1 text-slate-400 hover:text-white text-sm">
            <X className="h-4 w-4" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-900/50 border border-slate-700 rounded-lg items-end">
          <div className="flex flex-col">
            <MultiSelectFilter
              label="Teams"
              options={teamOptions}
              selectedValues={filters.teams}
              onChange={(values) => updateFilters('teams', values)}
              placeholder="All teams"
            />
          </div>

          <div className="flex flex-col">
            <MultiSelectFilter
              label="Positions"
              options={positionOptions}
              selectedValues={filters.positions}
              onChange={(values) => updateFilters('positions', values)}
              placeholder="All positions"
            />
          </div>

          <div className="flex flex-col">
            <MultiSelectFilter
              label="Stat Types"
              options={statTypeOptions}
              selectedValues={filters.statTypes}
              onChange={(values) => updateFilters('statTypes', values)}
              placeholder="All stats"
            />
          </div>
        </div>
      )}

      {/* Active Filter Summary */}
      {hasActiveFilters && !showFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.teams.map((team) => {
            const option = teamOptions.find((opt) => opt.value === team)
            return (
              <span
                key={team}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#00CED1]/20 text-[#00CED1] text-xs rounded-md"
              >
                {option?.label || team}
                <button
                  onClick={() =>
                    updateFilters(
                      'teams',
                      filters.teams.filter((t) => t !== team),
                    )
                  }
                  className="hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )
          })}

          {filters.positions.map((position) => {
            const option = positionOptions.find((opt) => opt.value === position)
            return (
              <span
                key={position}
                className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-md"
              >
                {option?.label || position}
                <button
                  onClick={() =>
                    updateFilters(
                      'positions',
                      filters.positions.filter((p) => p !== position),
                    )
                  }
                  className="hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )
          })}

          {filters.statTypes.map((statType) => {
            const option = statTypeOptions.find((opt) => opt.value === statType)
            return (
              <span
                key={statType}
                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-md"
              >
                {option?.label || statType}
                <button
                  onClick={() =>
                    updateFilters(
                      'statTypes',
                      filters.statTypes.filter((s) => s !== statType),
                    )
                  }
                  className="hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
