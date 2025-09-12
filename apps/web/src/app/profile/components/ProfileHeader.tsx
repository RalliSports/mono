import ProfilePicture from './ProfilePicture'
import UsernameEditor from './UsernameEditor'
import StatsGrid from './StatsGrid'
import NotificationsButton from './NotificationsButton'
import ReferFriendsSection from './ReferFriendsSection'

interface ProfileHeaderProps {
  balances: { ralli: number }
  formatBalance: (amount: number) => string
  onEditPictureClick: () => void
  avatar: string
}

export default function ProfileHeader({ balances, formatBalance, onEditPictureClick, avatar }: ProfileHeaderProps) {
  return (
    <div className="px-4 pt-6 pb-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <ProfilePicture onEditClick={onEditPictureClick} avatar={avatar} />

          <div className="flex-1">
            <UsernameEditor />
            <NotificationsButton />
          </div>
        </div>

        <StatsGrid balances={balances} formatBalance={formatBalance} />

        {/* Refer Friends Section */}
        <div className="mt-4">
          <ReferFriendsSection />
        </div>
      </div>
    </div>
  )
}
