import { Button } from '@/components/ui/button'
import { useFriends } from '@/hooks/api/use-friend'
import { Loader2, UserMinusIcon, UserRoundPlus, MessageCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import NotificationsButton from './NotificationsButton'
import ProfilePicture from './ProfilePicture'
import ReferFriendsSection from './ReferFriendsSection'
import StatsGrid from './StatsGrid'
import UsernameEditor from './UsernameEditor'
import { useChat } from '@/hooks/api/use-chat'
import { ProfileTabType } from '../hooks/useProfileTabs'
import { Channel } from 'stream-chat'

interface ProfileHeaderProps {
  balances: { ralli: number }
  formatBalance: (amount: number) => string
  onEditPictureClick: () => void
  setActiveTab: (tab: ProfileTabType) => void
  setActiveChannel: (channel: Channel | null) => void
  avatar: string
  currentUserId: string
  isConnected: boolean
  session: string
  userHasStreamChat: boolean
}

export default function ProfileHeader({
  balances,
  formatBalance,
  onEditPictureClick,
  avatar,
  isConnected,
  session,
  currentUserId,
  setActiveTab,
  setActiveChannel,
  userHasStreamChat,
}: ProfileHeaderProps) {
  const { friend, toggle } = useFriends(session as string)
  const { connectToDirectMessage } = useChat()

  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') ?? ''

  const handleToggleFollow = async () => {
    try {
      await toggle.mutateAsync()
    } catch (error) {
      console.log('could not toogle follow:', error)
    }
  }
  const handleConnectToDirectMessage = async () => {
    try {
      const channel = await connectToDirectMessage(userId)
      setActiveTab('chats')
      setActiveChannel(channel)
    } catch (error) {
      console.log('could not connect to direct message:', error)
    }
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <ProfilePicture onEditClick={onEditPictureClick} avatar={avatar} userId={userId} />

          <div className="flex-1">
            {<UsernameEditor userId={userId} />}
            {isConnected && !userId ? <NotificationsButton /> : null}
            {userId && (
              <div className="flex items-center gap-2">
                <Button onClick={handleToggleFollow} disabled={toggle.isPending}>
                  {toggle.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : friend.data?.isFollowing ? (
                    <span className="flex items-center gap-2 cursor-pointer">
                      <UserMinusIcon size={20} /> Unfollow
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 cursor-pointer">
                      <UserRoundPlus size={20} /> Follow
                    </span>
                  )}
                </Button>
                {userHasStreamChat && (
                  <Button onClick={handleConnectToDirectMessage} disabled={toggle.isPending}>
                    <span className="flex items-center gap-2 cursor-pointer">
                      <MessageCircle size={20} /> Message
                    </span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {!userId ? <StatsGrid balances={balances} formatBalance={formatBalance} /> : null}

        {/* Refer Friends Section */}
        <div className="mt-4">
          <ReferFriendsSection />
        </div>
      </div>
    </div>
  )
}
