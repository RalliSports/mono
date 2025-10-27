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
  const { client, isConnectedToClient } = useChat()
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

  // Store channel ID from URL for later loading
  const [pendingChannelId, setPendingChannelId] = useState<string | null>(null)

  // Handle URL parameters immediately when mounted
  useEffect(() => {
    const channelId = searchParams.get('channel')
    const tab = searchParams.get('tab')

    console.log('🔄 URL params effect:', { channelId, tab, mounted, activeTab })

    if (mounted) {
      // Set pending channel if we have one
      if (channelId) {
        console.log('🔗 Setting pending channel from URL:', channelId)
        setPendingChannelId(channelId)

        // Ensure we're on the chats tab if no tab specified
        if (!tab && activeTab !== 'chats') {
          console.log('🎯 Setting tab to chats (no tab in URL)')
          setActiveTab('chats')
        }
      }
    }
  }, [searchParams, mounted, activeTab, setActiveTab])

  // Handle loading pending channel when Stream.io becomes ready
  useEffect(() => {
    console.log('🔄 Pending channel effect:', {
      pendingChannelId,
      isConnectedToClient,
      hasActiveChannel: !!activeChannel,
      user: user?.id,
    })

    if (pendingChannelId && isConnectedToClient && !activeChannel && user?.id) {
      console.log('🔗 Loading pending channel:', pendingChannelId)

      const loadChannel = async () => {
        try {
          console.log('✅ Stream.io connected, loading channel:', pendingChannelId)
          // Get the channel and watch it to load messages
          // Include current user as member to ensure access
          const channel = client.channel('messaging', pendingChannelId, {
            members: [user.id],
          })
          console.log('⏳ Watching channel...', channel)

          // Try to watch the channel (this will create it if it doesn't exist)
          const channelState = await channel.watch()
          console.log('🎬 Channel watched successfully:', channelState)
          console.log('📝 Channel state:', channel.state)
          console.log('💬 Messages count:', channel.state.messages.length)

          setActiveChannel(channel)
          setPendingChannelId(null) // Clear pending
          console.log('✅ Successfully loaded channel from notification:', pendingChannelId)
        } catch (error) {
          console.error('💥 Failed to watch channel from URL:', error)
          console.error('Error details:', error)
          // Don't clear pending channel on error, might retry later
        }
      }

      loadChannel()
    }
  }, [pendingChannelId, isConnectedToClient, activeChannel, client, setActiveChannel, user?.id])

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
        {(() => {
          console.log('🎨 Rendering tab content, activeTab:', activeTab)
          return null
        })()}
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
          <>
            {(() => {
              console.log('🎯 Rendering ChatsSection with activeChannel:', activeChannel?.id)
              return null
            })()}
            <ChatsSection
              activeChannel={activeChannel}
              setActiveChannel={setActiveChannel}
              isCurrentUser={isCurrentUser}
            />
          </>
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
