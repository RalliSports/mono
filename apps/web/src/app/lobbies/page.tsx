'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SidebarNav from '@/components/ui/sidebar-nav'
import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'

// Components
import {
  TopNavigation,
  FilterTabs,
  SearchBar,
  PageHeader,
  ResultsSummary,
  LobbiesGrid,
  EmptyState,
  LoadingState,
  ErrorState,
  LobbiesGridSkeleton,
  FilterTabsSkeleton,
} from './components'

// Hooks and Constants
import { useLobbies } from './hooks/useLobbies'
import { useUser } from './hooks/useUser'
import { useLobbiesFilters } from './hooks/useLobbiesFilters'
import { createFilterTabs } from './constants/filterTabs'

export default function LobbiesPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  // Custom hooks
  const { lobbiesData, lobbiesError, lobbiesLoading, retryFetch } = useLobbies()
  const { user } = useUser()
  const { selectedFilter, setSelectedFilter, searchQuery, setSearchQuery, filteredLobbies } =
    useLobbiesFilters(lobbiesData)

  // Para wallet balance hook
  const {
    isConnected,
    balances,
    isLoading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useParaWalletBalance()

  // Create filter tabs based on current data
  const filterTabs = createFilterTabs(lobbiesData)

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileDropdownOpen) {
        const target = event.target as Element
        if (!target.closest('.profile-dropdown')) {
          setIsProfileDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileDropdownOpen])

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null
  }

  // Show loading state while fetching lobbies
  if (lobbiesLoading) {
    return <LoadingState />
  }

  // Show error state if there's an error
  if (lobbiesError) {
    return <ErrorState error={lobbiesError} onRetry={retryFetch} />
  }

  // Balance props for TopNavigation
  const balanceProps = {
    isConnected,
    balances,
    isLoading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Top Navigation Bar */}
      <TopNavigation
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
        user={user}
        balanceProps={balanceProps}
      />

      {/* Lobby Status Filter Tabs */}
      {lobbiesLoading ? (
        <FilterTabsSkeleton />
      ) : (
        <FilterTabs filterTabs={filterTabs} selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
      )}

      {/* Search and Quick Actions */}
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="max-w-none mx-auto px-6 py-6">
        {/* Page Header */}
        <PageHeader onCreateGame={() => router.push('/create-game')} />

        {/* Results Summary */}
        {!lobbiesLoading && (
          <ResultsSummary
            searchQuery={searchQuery}
            resultCount={filteredLobbies.length}
            onClearSearch={() => setSearchQuery('')}
          />
        )}

        {/* Lobbies Grid or Empty State */}
        {lobbiesLoading ? (
          <LobbiesGridSkeleton count={8} />
        ) : filteredLobbies.length > 0 ? (
          <LobbiesGrid lobbies={filteredLobbies} user={user} />
        ) : (
          <EmptyState
            searchQuery={searchQuery}
            selectedFilter={selectedFilter}
            onClearSearch={() => setSearchQuery('')}
            onCreateGame={() => router.push('/create-game')}
          />
        )}
      </div>

      {/* Sidebar Navigation */}
      <SidebarNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}
