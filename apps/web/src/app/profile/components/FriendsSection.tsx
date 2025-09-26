import { useFriends } from '@/hooks/api/use-friend'
import { useState } from 'react'
import FollowButton from './FollowButton'
import Link from 'next/link'

interface Props {
  currentUserId: string
  session: string
}
export default function FriendsSection({ currentUserId, session }: Props) {
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following')
  const { followers, following, toggle, friend: friends } = useFriends(session, currentUserId)

  return (
    <div>
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-2 shadow-2xl">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveTab('following')}
            className={`py-3 px-4 rounded-xl transition-all duration-200 font-semibold ${
              activeTab === 'following'
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border border-green-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setActiveTab('followers')}
            className={`py-3 px-4 rounded-xl transition-all duration-200 font-semibold ${
              activeTab === 'followers'
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border border-green-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Followers
          </button>
        </div>
      </div>

      {activeTab === 'following' &&
        (following?.data?.flat() ?? []).map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between p-3 my-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
          >
            <Link href={`/profile?userId=${friend.followingId}`}>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={friend.following.avatar ?? ''}
                    alt={friend.following.firstName ?? ''}
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{friend.following.firstName ?? ''}</div>
                  <div className="text-slate-400 text-xs">{friend.following.username ?? ''}</div>
                </div>
              </div>
            </Link>

            <FollowButton session={session} targetUserId={friend.following.id} />
          </div>
        ))}

      {activeTab === 'followers' &&
        (followers?.data?.flat() ?? []).map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between p-3 my-2 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
          >
            <Link href={`/profile?userId=${friend.followerId}`}>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={friend.follower.avatar ?? ''}
                    alt={friend.follower.firstName ?? ''}
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{friend.follower.firstName ?? ''}</div>
                  <div className="text-slate-400 text-xs">{friend.follower.username ?? ''}</div>
                </div>
              </div>
            </Link>
            <FollowButton session={session} targetUserId={friend.follower.id} />
          </div>
        ))}
    </div>
  )
}
