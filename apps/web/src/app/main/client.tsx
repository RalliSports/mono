'use client'

import SelectionBar from '@/components/main-feed/selection-bar'
import AthleteProfilePopup from '@/components/main-feed/athlete-profile-popup'
import SidebarNav from '@/components/ui/sidebar-nav'
import { useSessionToken } from '@/hooks/use-session'

// Components
import { TopNavigation, FilterBar, LobbiesSection, LoadingScreen, LobbiesSectionSkeleton } from './components'

// Hooks
import { useWalletConnection } from './hooks/useWalletConnection'
import { useMainPage } from './hooks/useMainPage'

export default function MainFeedPage() {
  const { session } = useSessionToken()

  // console.log(session)

  // Custom hooks for separation of concerns
  const { mounted, isConnected, balances, balanceLoading, balanceError, shouldShowLoading } = useWalletConnection(false)
  console.log('isConnected', isConnected)
  // const { user } = useUserData()

  const {
    lobbiesData,
    lobbiesLoading,
    selectedAthletes,
    athletes,
    isInSelectionMode,
    setIsInSelectionMode,
    requiredSelections,
    profilePopupAthleteId,
    setProfilePopupAthleteId,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useMainPage(session)

  // Don't render until mounted to prevent hydration issues
  // if (!mounted) {
  //   return null
  // }

  // Show loading state while checking wallet connection
  if (shouldShowLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Top Navigation Bar */}
      <TopNavigation
        onMenuClick={() => setIsSidebarOpen(true)}
        isConnected={isConnected}
        balances={balances}
        balanceLoading={balanceLoading}
        balanceError={balanceError}
      />

      {/* Filters and Search */}
      {/* <FilterBar /> */}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile and Desktop Layouts */}
        {lobbiesLoading ? (
          <>
            <LobbiesSectionSkeleton />
          </>
        ) : (
          <>
            <LobbiesSection lobbiesData={lobbiesData} />
          </>
        )}
      </div>

      {/* Bottom Selection Bar (when in selection mode) */}
      {isInSelectionMode && (
        <SelectionBar
          selectedAthletes={selectedAthletes}
          requiredSelections={requiredSelections}
          athletes={athletes}
          onCancel={() => setIsInSelectionMode(false)}
          onContinue={() => {
            // Handle continue logic here
            setIsInSelectionMode(false)
          }}
        />
      )}

      {/* Athlete Profile Popup */}
      {mounted && (
        <AthleteProfilePopup
          athleteId={profilePopupAthleteId || ''}
          isOpen={!!profilePopupAthleteId}
          onClose={() => setProfilePopupAthleteId(null)}
        />
      )}

      {/* Sidebar Navigation */}
      <SidebarNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}
