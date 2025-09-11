import { useState } from 'react'
import { useReferral } from '@/hooks/useReferral'

interface ReferralShareProps {
  gameId?: string
  className?: string
}

export default function ReferralShare({ gameId, className = '' }: ReferralShareProps) {
  const [copied, setCopied] = useState(false)
  const { userReferralCode, referralStats, generateReferralLink, generateGameReferralLink } = useReferral()

  const referralCode = userReferralCode

  const handleShare = async () => {
    if (!referralCode) return

    const shareUrl = gameId ? generateGameReferralLink(referralCode, gameId) : generateReferralLink(referralCode)

    const shareData = {
      title: gameId ? 'Join my game on Ralli!' : 'Join me on Ralli!',
      text: gameId
        ? `Join my game on Ralli - the decentralized sports betting platform!`
        : `Join me on Ralli - the decentralized sports betting platform!`,
      url: shareUrl,
    }

    try {
      // Check if native share API is available (mobile)
      if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        await navigator.share(shareData)
      } else {
        // Desktop: copy to clipboard
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      console.error('Error sharing:', error)
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError)
      }
    }
  }

  if (!referralCode) {
    return null
  }

  return (
    <div className={`bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Your Referral Code</h3>
        <span className="text-slate-400 text-sm font-mono bg-slate-700/50 px-2 py-1 rounded">{referralCode}</span>
      </div>

      {referralStats && (
        <div className="text-slate-400 text-sm mb-3">
          <span className="text-green-400 font-semibold">{referralStats.completedReferrals}</span> successful referrals
        </div>
      )}

      <button
        onClick={handleShare}
        className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
      >
        <svg
          className="w-4 h-4"
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
        {copied ? 'Copied!' : 'Share Referral Link'}
      </button>
    </div>
  )
}
