import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function useReferralCode() {
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check URL parameters for referral code
    const refFromUrl = searchParams.get('ref')
    if (refFromUrl) {
      setReferralCode(refFromUrl)
      // Store in localStorage for persistence across the signup flow
      localStorage.setItem('referralCode', refFromUrl)
    } else {
      // Check localStorage for existing referral code
      const storedCode = localStorage.getItem('referralCode')
      if (storedCode) {
        setReferralCode(storedCode)
      }
    }
  }, [searchParams])

  const clearReferralCode = () => {
    setReferralCode(null)
    localStorage.removeItem('referralCode')
  }

  return {
    referralCode,
    setReferralCode,
    clearReferralCode,
  }
}
