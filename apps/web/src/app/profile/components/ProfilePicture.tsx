import Image from 'next/image'
import { User } from './types'

interface ProfilePictureProps {
  user: User
  onEditClick: () => void
}

export default function ProfilePicture({ user, onEditClick }: ProfilePictureProps) {
  return (
    <div className="relative group">
      <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border-2 border-slate-600/50 transition-all duration-300 group-hover:border-[#00CED1]/30">
        {user.avatar && user.avatar !== 'https://static.wikifutbol.com/images/b/b8/AthleteDefault.jpg' ? (
          <Image
            src={user.avatar}
            alt="Profile Picture"
            width={80}
            height={80}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-slate-600 flex items-center justify-center transition-all duration-300 group-hover:bg-slate-500">
            <svg
              className="w-8 h-8 text-slate-400 transition-colors duration-300 group-hover:text-slate-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      {/* Edit Button */}
      <button
        onClick={onEditClick}
        className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 border-2 border-slate-800 group"
      >
        <svg
          className="w-3.5 h-3.5 text-white transition-transform duration-200 group-hover:rotate-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      </button>
    </div>
  )
}
