import { useReferral } from '@/hooks/useReferral'
import { GamesServiceFindOne } from '@repo/server'
import Image from 'next/image'
import { useState } from 'react'
import CreateNewGameButton from './CreateNewGameButton'
interface GameHeaderProps {
  lobby: GamesServiceFindOne
}

export default function GameHeader({ lobby }: GameHeaderProps) {
  const [imageSrc, setImageSrc] = useState(lobby.imageUrl)
  const [hasErrored, setHasErrored] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const { userReferralCode } = useReferral()

  const handleError = () => {
    if (!hasErrored) {
      setHasErrored(true)
      setImageSrc('/images/pfp-2.svg') // Use local fallback
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    const shareUrl = `${window.location.origin}/game?id=${lobby.id}&ref=${userReferralCode}&code=${lobby.gameCode}`
    const shareData = {
      title: lobby.title || 'Ralli Game',
      text: `Check out this game on Ralli: ${lobby.title}`,
      url: shareUrl,
    }

    try {
      // Check if native share API is available (mobile)
      if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        await navigator.share(shareData)
      } else {
        // Desktop: copy to clipboard
        await navigator.clipboard.writeText(shareUrl)
        // You could add a toast notification here
      }
    } catch (error) {
      console.error('Error sharing:', error)
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl)
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError)
      }
    } finally {
      setIsSharing(false)
    }
  }
  return (
    <div className="pt-6 pb-4">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-xl overflow-hidden">
              {
                <Image
                  src={imageSrc || '/images/pfp-2.svg'}
                  alt={lobby.title || 'Game'}
                  className="w-16 h-16 object-cover rounded-xl"
                  width={64}
                  height={64}
                  onError={(e) => {
                    e.currentTarget.onerror = handleError
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(lobby.creator?.username || 'Anonymous User')}&background=0D8ABC&color=fff&size=128`
                  }}
                />
              }
            </div>
          </div>
          <div className="flex-1">
            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <h3 className="text-white font-bold text-xl truncate">{lobby.title}</h3>
              <div className="flex items-center gap-2">
                <CreateNewGameButton lobby={lobby} size="small" />
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="flex-shrink-0 p-2 hover:bg-slate-700/50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Share game"
                >
                  <svg
                    className="w-5 h-5 text-slate-400 hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden">
              <h3 className="text-white font-bold text-xl truncate mb-2">{lobby.title}</h3>
              <div className="flex items-center gap-2">
                <CreateNewGameButton lobby={lobby} size="small" />
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="flex-shrink-0 p-2 hover:bg-slate-700/50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Share game"
                >
                  <svg
                    className="w-4 h-4 text-slate-400 hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Host • Created {new Date(lobby.createdAt || '').toLocaleDateString()}
            </p>
            <div>
              <div className="flex items-center gap-2 ">
                <span className="text-slate-300 font-medium text-sm">
                  {lobby.participants.length}/{lobby.maxParticipants} players
                </span>
                <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                <span className="text-slate-400 text-sm">{lobby.numBets} legs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
