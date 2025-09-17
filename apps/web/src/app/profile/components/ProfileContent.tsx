import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { useSessionToken } from '@/hooks/use-session'
import TopNavigation from './TopNavigation'
import ProfileHeader from './ProfileHeader'
import ProfilePictureUploadModal from './ProfilePictureUploadModal'
import ActiveParlaysSection from './ActiveParlaysSection'
import HistorySection from './HistorySection'
import AchievementsSection from './AchievementsSection'
import ProfileHeaderSkeleton from './ProfileHeaderSkeleton'
import ActiveParleysSectionSkeleton from './ActiveParleysSectionSkeleton'
import PastParleysSectionSkeleton from './PastParleysSectionSkeleton'
import { useProfile } from '../hooks/useProfile'
import { useProfilePictureUpload } from '../hooks/useProfilePictureUpload'
import { useProfileTabs } from '../hooks/useProfileTabs'
import { formatBalance } from '@/lib/utils'
import PastParlaysSection from './PastParlaysSection'

export default function ProfileContent() {
  const { session } = useSessionToken()
  const { activeTab, setActiveTab, mounted } = useProfileTabs()

  const {
    user,
    userLoading,
    gamesLoading,
    myOpenGames,
    myCompletedGames,
    username,
    firstName,
    lastName,
    setUser,
    setAvatar,
    setForceRefresh,
  } = useProfile(session || null)

  const { isUploadModalOpen, setIsUploadModalOpen, isUploading, handleFileSelect } = useProfilePictureUpload(
    session || null,
    username,
    firstName,
    lastName,
    setUser as (user: unknown) => void,
    setAvatar,
  )

  // Para wallet balance hook
  const { isConnected, balances, isLoading: balanceLoading, error: balanceError } = useParaWalletBalance()

  // Don't render until mounted to prevent hydration issues
  if (!mounted || userLoading || !user) {
    return null
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <TopNavigation
        isConnected={isConnected}
        balances={balances}
        balanceLoading={balanceLoading}
        balanceError={balanceError?.message}
        formatBalance={formatBalance}
      />

      {userLoading ? (
        <ProfileHeaderSkeleton />
      ) : (
        <ProfileHeader
          balances={balances}
          formatBalance={formatBalance}
          onEditPictureClick={() => setIsUploadModalOpen(true)}
          avatar={user.avatar || ''}
        />
      )}

      {/* Tab Content */}
      <div className="px-4 pb-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {gamesLoading ? (
              <>
                <ActiveParleysSectionSkeleton />
                <PastParleysSectionSkeleton />
              </>
            ) : (
              <>
                <ActiveParlaysSection myOpenGames={myOpenGames} user={user} setActiveTab={setActiveTab} />
                <PastParlaysSection myCompletedGames={myCompletedGames} user={user} setActiveTab={setActiveTab} />
              </>
            )}
          </div>
        )}

        {activeTab === 'history' && <HistorySection />}

        {activeTab === 'achievements' && <AchievementsSection />}
      </div>

      <ProfilePictureUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        isUploading={isUploading}
        onFileSelect={handleFileSelect}
        session={session || null}
        onUploadComplete={() => {
          setTimeout(() => {
            setForceRefresh(true)
          }, 1000)
        }}
        avatar={user.avatar || ''}
        setAvatar={setAvatar}
      />
    </div>
  )
}
