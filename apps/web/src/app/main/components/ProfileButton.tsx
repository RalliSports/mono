'use client'

import { useRouter } from 'next/navigation'
import { useUserData } from '@/providers/user-data-provider'
import Image from 'next/image'

export default function ProfileButton() {
  const router = useRouter()
  const { user } = useUserData()

  const handleProfileClick = () => {
    router.push('/profile')
  }

  return (
    <button
      onClick={handleProfileClick}
      className="w-10 h-10 rounded-full bg-slate-800/50 border-2 border-slate-600/70 hover:bg-slate-700/50 hover:border-[#00CED1]/60 hover:shadow-lg hover:shadow-[#00CED1]/20 transition-all duration-300 overflow-hidden group ring-1 ring-slate-500/30"
    >
      {user ? (
        <Image
          src={user.avatar || '/images/pfp-1.svg'}
          alt={user.username || 'Profile'}
          width={40}
          height={40}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  )
}
