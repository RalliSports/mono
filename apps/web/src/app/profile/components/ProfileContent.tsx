import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { useSessionToken } from '@/hooks/use-session'
import TopNavigation from './TopNavigation'
import ProfileHeader from './ProfileHeader'
import ProfilePictureUploadModal from './ProfilePictureUploadModal'
import ActiveParlaysSection from './ActiveParlaysSection'
import HistorySection from './HistorySection'
import AchievementsSection from './AchievementsSection'
import { useProfile } from '../hooks/useProfile'
import { useProfilePictureUpload } from '../hooks/useProfilePictureUpload'
import { useProfileTabs } from '../hooks/useProfileTabs'
import { formatBalance } from '@/lib/utils'
import PastParlaysSection from './PastParlaysSection'

export default function ProfileContent() {
  const { session } = useSessionToken()
  const { activeTab, setActiveTab, mounted, editingUsername, setEditingUsername } = useProfileTabs()

  const {
    username,
    setUsername,
    user,
    setUser,
    setAvatar,
    firstName,
    lastName,
    myOpenGames,
    myCompletedGames,
    handleUpdateUser,
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
  if (!mounted || !user) {
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

      <ProfileHeader
        user={user}
        username={username}
        setUsername={setUsername}
        editingUsername={editingUsername}
        setEditingUsername={setEditingUsername}
        onUpdateUser={handleUpdateUser}
        onEditPictureClick={() => setIsUploadModalOpen(true)}
        balances={balances}
        formatBalance={formatBalance}
      />

      {/* Tab Content */}
      <div className="px-4 pb-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <ActiveParlaysSection myOpenGames={myOpenGames} user={user} setActiveTab={setActiveTab} />
            <PastParlaysSection myCompletedGames={myCompletedGames} user={user} setActiveTab={setActiveTab} />
          </div>
        )}

        {activeTab === 'history' && <HistorySection />}

        {activeTab === 'achievements' && <AchievementsSection />}
      </div>

      <ProfilePictureUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        isUploading={isUploading}
        user={user}
        onFileSelect={handleFileSelect}
        session={session || null}
      />
    </div>
  )
}
