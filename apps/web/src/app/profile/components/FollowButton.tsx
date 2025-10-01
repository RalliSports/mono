import { Button } from '@/components/ui/button'
import { useFriends } from '@/hooks/api/use-friend'
import { UserMinusIcon, UserRoundPlus } from 'lucide-react'

interface FollowButtonProps {
  targetUserId: string // the user we want to follow/unfollow
  session: string
}

export default function FollowButton({ targetUserId, session }: FollowButtonProps) {
  const { toggle, friend } = useFriends(session, targetUserId)

  const handleToggleFollow = async () => {
    try {
      await toggle.mutateAsync()
    } catch (error) {
      console.log('could not toogle follow:', error)
    }
  }

  return (
    <Button onClick={handleToggleFollow} disabled={toggle.isPending}>
      {friend.data?.isFollowing ? (
        <span className="flex items-center gap-2 cursor-pointer">
          <UserMinusIcon size={20} /> Unfollow
        </span>
      ) : (
        <span className="flex items-center gap-2 cursor-pointer">
          <UserRoundPlus size={20} /> Follow
        </span>
      )}
    </Button>
  )
}
