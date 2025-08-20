import ProfilePicture from './ProfilePicture'
import UsernameEditor from './UsernameEditor'
import StatsGrid from './StatsGrid'
import { User } from './types'

interface ProfileHeaderProps {
  user: User
  username: string
  setUsername: (username: string) => void
  editingUsername: boolean
  setEditingUsername: (editing: boolean) => void
  onUpdateUser: () => Promise<void>
  onEditPictureClick: () => void
  balances: { ralli: number }
  formatBalance: (amount: number) => string
}

export default function ProfileHeader({
  user,
  username,
  setUsername,
  editingUsername,
  setEditingUsername,
  onUpdateUser,
  onEditPictureClick,
  balances,
  formatBalance,
}: ProfileHeaderProps) {
  return (
    <div className="px-4 pt-6 pb-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <ProfilePicture user={user} onEditClick={onEditPictureClick} />

          <div className="flex-1">
            <UsernameEditor
              user={user}
              username={username}
              setUsername={setUsername}
              editingUsername={editingUsername}
              setEditingUsername={setEditingUsername}
              onUpdateUser={onUpdateUser}
            />
          </div>
        </div>

        <StatsGrid balances={balances} formatBalance={formatBalance} />
      </div>
    </div>
  )
}
