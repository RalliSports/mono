export interface User {
  id: string
  emailAddress: string
  walletAddress: string
  paraUserId: string
  firstName?: string
  lastName?: string
  username?: string
  avatar?: string
}

export interface FilterTab {
  id: string
  name: string
  icon: string
  count: number
  color: string
}

export interface BalanceDisplayProps {
  isConnected: boolean
  balances: {
    sol: number
    ralli: number
    totalUsd: number
  }
  isLoading: boolean
  error: any
  refetch: () => void
}

export interface ProfileDropdownProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onNavigateToProfile: () => void
}

export interface FilterTabsProps {
  filterTabs: FilterTab[]
  selectedFilter: string
  onFilterChange: (filterId: string) => void
}

export interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export interface PageHeaderProps {
  onCreateGame: () => void
}

export interface ResultsSummaryProps {
  searchQuery: string
  resultCount: number
  onClearSearch: () => void
}

export interface LobbiesGridProps {
  lobbies: any[]
  user: User | null
}

export interface EmptyStateProps {
  searchQuery: string
  selectedFilter: string
  onClearSearch: () => void
  onCreateGame: () => void
}

export interface LoadingStateProps {}

export interface ErrorStateProps {
  error: string
  onRetry: () => void
}
