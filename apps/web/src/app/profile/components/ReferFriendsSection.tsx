'use client'

import { useState } from 'react'
import { useReferral } from '@/hooks/useReferral'
import { toast } from 'react-toastify'

export default function ReferFriendsSection() {
  const { userReferralCode, generateReferralLink, isGeneratingCode, generateReferralCode } = useReferral()
  const [isSharing, setIsSharing] = useState(false)

  console.log('ReferFriendsSection - userReferralCode:', userReferralCode)

  const handleShare = async () => {
    if (!userReferralCode) {
      // Generate a referral code if user doesn't have one
      generateReferralCode()
      return
    }

    setIsSharing(true)

    const referralLink = generateReferralLink(userReferralCode)

    try {
      const shareData = {
        title: 'Join me on Ralli!',
        text: 'Check out Ralli - the sports betting platform I use!',
        url: referralLink,
      }

      // Check if native share API is available (mobile)
      if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        await navigator.share(shareData)
      } else {
        // Desktop: copy to clipboard
        await navigator.clipboard.writeText(referralLink)
        toast.success('Referral link copied to clipboard!', {
          position: 'bottom-center',
          autoClose: 3000,
        })
      }
    } catch (error) {
      console.error('Error sharing:', error)
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(referralLink)
        toast.success('Referral link copied to clipboard!', {
          position: 'bottom-center',
          autoClose: 3000,
        })
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError)
        toast.error('Failed to share referral link', {
          position: 'bottom-center',
          autoClose: 3000,
        })
      }
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-[#00CED1]/10 to-[#FFAB91]/10 border border-[#00CED1]/20 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-sm mb-1">Refer Your Friends</h3>
          <p className="text-gray-400 text-xs">Share Ralli with friends and earn rewards when they join!</p>
        </div>

        <button
          onClick={handleShare}
          disabled={isSharing || isGeneratingCode}
          className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSharing ? (
            'Sharing...'
          ) : isGeneratingCode ? (
            'Generating...'
          ) : (
            <>
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              Share
            </>
          )}
        </button>
      </div>
    </div>
  )
}
