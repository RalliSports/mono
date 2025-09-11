'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useModal, useAccount } from '@getpara/react-sdk'
import { useToast } from '@/components/ui/toast'
import { useReferral } from '@/hooks/useReferral'

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const modal = useModal()
  const { openModal } = modal
  const account = useAccount()
  const { addToast } = useToast()
  const { referralCode } = useReferral()
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const modalOpenedRef = useRef(false)
  const toastShownRef = useRef(false)

  const callbackUrl = searchParams.get('callbackUrl') || '/main'

  // Stop monitoring
  const stopModalMonitoring = () => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current)
      checkIntervalRef.current = null
    }
  }

  // Handle authentication state - show success toast when connected
  useEffect(() => {
    // If user just connected, show success toast
    if (account?.isConnected === true && !toastShownRef.current) {
      stopModalMonitoring()
      toastShownRef.current = true
      router.push(callbackUrl)
      // addToast('Successfully signed in! Click the button to go to Main', 'success', 6000)
      return
    }
  }, [account?.isConnected, router, callbackUrl, addToast])

  // Manual navigation to main
  const handleGoToMain = () => {
    router.push(callbackUrl)
  }

  // Manual modal open handler
  const handleOpenModal = () => {
    if (!modalOpenedRef.current) {
      modalOpenedRef.current = true
    }
    openModal()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopModalMonitoring()
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-stone-100">
      <div className="text-center">
        {account?.isConnected === true ? (
          // Successfully connected - show success state
          <>
            <div className="w-16 h-16 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent mb-2">
              Successfully Signed In!
            </h1>
            <p className="text-gray-600 mb-6">Your wallet is now connected. Ready to start betting?</p>
            <button
              onClick={handleGoToMain}
              className="px-8 py-3 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Go to Main
            </button>
          </>
        ) : account?.isConnected === false ? (
          // Not connected - show connect button
          <>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent mb-4">
              Welcome to Ralli
            </h1>
            {referralCode && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                <p className="text-sm">
                  🎉 You were invited by a friend! You&apos;ll get special rewards when you join.
                </p>
              </div>
            )}
            <p className="text-gray-600 mb-6">Sign in to continue</p>
            <button
              onClick={handleOpenModal}
              className="px-8 py-3 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Sign In
            </button>
          </>
        ) : (
          // Loading state
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CED1] mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent mb-2">
              Welcome to Ralli
            </h1>
            <p className="text-gray-600">Checking connection status...</p>
          </>
        )}
      </div>
    </div>
  )
}
