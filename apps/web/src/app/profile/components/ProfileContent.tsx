'use client'

import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'
import { useSessionToken } from '@/hooks/use-session'
import { formatBalance } from '@/lib/utils'
import ProfileHeaderSkeleton from './ProfileHeaderSkeleton'
import ActiveParleysSectionSkeleton from './ActiveParleysSectionSkeleton'
import PastParleysSectionSkeleton from './PastParleysSectionSkeleton'
import { useProfile } from '../hooks/useProfile'
import { useProfilePictureUpload } from '../hooks/useProfilePictureUpload'
import { useProfileTabs } from '../hooks/useProfileTabs'
import AchievementsSection from './AchievementsSection'
import ActiveParlaysSection from './ActiveParlaysSection'
import HistorySection from './HistorySection'
import PastParlaysSection from './PastParlaysSection'
import ChatsSection from './ChatsSection'
import ProfileHeader from './ProfileHeader'
import ProfilePictureUploadModal from './ProfilePictureUploadModal'
import TopNavigation from './TopNavigation'
import TabNavigation from './TabNavigation'
import { useUser } from '@/hooks/api'
import { useEffect, useState } from 'react'
import { Channel } from 'stream-chat'
import { useChat } from '@/hooks/api/use-chat'
import FriendsSection from './FriendsSection'
import { useSearchParams } from 'next/navigation'
import { UserServiceFindOne } from '@repo/server'

export default function ProfileContent() {
  const { session } = useSessionToken()
  const { activeTab, setActiveTab, mounted } = useProfileTabs()
  const [userHasStreamChat, setUserHasStreamChat] = useState(false)
  const { currentUser } = useUser()
  const { client, isConnectedToClient, ensureConnection } = useChat()
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)
  const searchParams = useSearchParams()

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
  } = useProfile(session || null)

  const { isUploadModalOpen, setIsUploadModalOpen, isUploading, handleFileSelect } = useProfilePictureUpload(
    session || null,
    username,
    firstName,
    lastName,
    setUser as (user: unknown) => void,
    setAvatar,
  )
  const isCurrentUser = currentUser.data?.id === user?.id

  // Para wallet balance hook
  const { isConnected, balances, isLoading: balanceLoading, error: balanceError } = useParaWalletBalance()

  useEffect(() => {
    const checkUserHasStreamChat = async () => {
      const response = await client.queryUsers({ id: user?.id })
      setUserHasStreamChat(response.users.length > 0)
    }
    if (user?.id && isConnectedToClient) {
      checkUserHasStreamChat()
    }
  }, [user, client, isConnectedToClient])

  // Handle tab and channel parameters from notification deep link
  useEffect(() => {
    const tab = searchParams.get('tab')
    const channelId = searchParams.get('channel')

    if (tab && mounted) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setActiveTab(tab as any)
    }

    if (channelId && mounted) {
      // Store the channel ID to load when Stream.io is ready
      const loadChannelWhenReady = async () => {
        try {
          // Ensure Stream.io connection is ready
          const connected = await ensureConnection()

          if (connected) {
            // Get the channel and watch it to load messages
            const channel = client.channel('messaging', channelId)
            await channel.watch()
            setActiveChannel(channel)
            // Ensure we're on the chats tab when opening a specific channel
            if (!tab) {
              setActiveTab('chats')
            }
            console.log('Successfully loaded channel from notification:', channelId)
          } else {
            console.warn('Failed to establish Stream.io connection for channel:', channelId)
          }
        } catch (error) {
          console.error('Failed to watch channel from URL:', error)
        }
      }

      loadChannelWhenReady()
    }
  }, [searchParams, isConnectedToClient, mounted, client, setActiveTab, ensureConnection])

  return (
    <div className="bg-gray-900 min-h-screen">
      <TopNavigation
        isConnected={isConnected}
        balances={balances}
        balanceLoading={balanceLoading}
        balanceError={balanceError?.message}
        formatBalance={formatBalance}
        isCurrentUser={isCurrentUser}
      />

      {userLoading ? (
        <ProfileHeaderSkeleton />
      ) : (
        <>
          <ProfileHeader
            isCurrentUser={isCurrentUser}
            userId={user?.id ?? ''}
            isConnected={isConnected}
            balances={balances}
            session={session ?? ''}
            formatBalance={formatBalance}
            onEditPictureClick={() => setIsUploadModalOpen(true)}
            avatar={user?.avatar || ''}
            setActiveTab={setActiveTab}
            setActiveChannel={setActiveChannel}
            userHasStreamChat={userHasStreamChat}
          />
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setActiveChannel={setActiveChannel}
            isCurrentUser={isCurrentUser}
            userId={user?.id as string}
            userHasStreamChat={userHasStreamChat}
          />
        </>
      )}

      {/* Tab Content */}
      <div className="px-4 pb-8">
        {activeTab === 'parlays' && (
          <div className="space-y-6">
            {gamesLoading ? (
              <>
                <ActiveParleysSectionSkeleton />
                <PastParleysSectionSkeleton />
              </>
            ) : (
              <>
                <ActiveParlaysSection myOpenGames={myOpenGames} user={user as UserServiceFindOne} />
                <PastParlaysSection myCompletedGames={myCompletedGames} user={user as UserServiceFindOne} />
              </>
            )}
          </div>
        )}

        {activeTab === 'history' && <HistorySection />}

        {activeTab === 'achievements' && <AchievementsSection />}
        {activeTab === 'friends' && <FriendsSection currentUserId={user?.id ?? ''} session={session ?? ''} />}

        {activeTab === 'chats' && (
          <ChatsSection
            activeChannel={activeChannel}
            setActiveChannel={setActiveChannel}
            isCurrentUser={isCurrentUser}
          />
        )}
      </div>

      <ProfilePictureUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        isUploading={isUploading}
        onFileSelect={handleFileSelect}
        session={session || null}
        onUploadComplete={() => {
          setTimeout(() => {}, 1000)
        }}
        avatar={user?.avatar || ''}
        setAvatar={setAvatar}
      />
    </div>
  )
}
