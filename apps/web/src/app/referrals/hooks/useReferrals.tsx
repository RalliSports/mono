'use client'

import { useState } from 'react'
import type { ActiveTab, CodeStatus, ReferralStatus, UserStats, Referral } from '../components/types'
import {
  ADJECTIVES,
  TAKEN_CODES,
  VALID_REFERRAL_CODES,
  CODE_VALIDATION,
  VALIDATION_DELAYS,
} from '../components/constants'

export function useReferrals() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('create')
  const [customCode, setCustomCode] = useState('')
  const [isCheckingCode, setIsCheckingCode] = useState(false)
  const [codeStatus, setCodeStatus] = useState<CodeStatus>(null)
  const [referralCode, setReferralCode] = useState('')
  const [isValidatingReferral, setIsValidatingReferral] = useState(false)
  const [referralStatus, setReferralStatus] = useState<ReferralStatus>(null)

  const [userStats] = useState<UserStats>({
    totalReferrals: 12,
    totalEarnings: 340.5,
    pendingRewards: 75.0,
    activeCode: 'RALLY-JOHN123',
  })

  const [recentReferrals] = useState<Referral[]>([
    {
      id: 1,
      username: 'Mike_B',
      earnings: 25.0,
      date: '2 days ago',
      status: 'confirmed',
    },
    {
      id: 2,
      username: 'Sarah_K',
      earnings: 25.0,
      date: '1 week ago',
      status: 'confirmed',
    },
    {
      id: 3,
      username: 'Alex_M',
      earnings: 25.0,
      date: '2 weeks ago',
      status: 'pending',
    },
  ])

  const checkCodeAvailability = async (code: string) => {
    if (code.length < CODE_VALIDATION.MIN_LENGTH) {
      setCodeStatus(null)
      return
    }

    setIsCheckingCode(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, VALIDATION_DELAYS.CODE_CHECK))

    if (CODE_VALIDATION.INVALID_CHARS_REGEX.test(code)) {
      setCodeStatus('invalid')
    } else if (TAKEN_CODES.includes(code.toUpperCase())) {
      setCodeStatus('taken')
    } else {
      setCodeStatus('available')
    }

    setIsCheckingCode(false)
  }

  const validateReferralCode = async (code: string) => {
    if (code.length < CODE_VALIDATION.MIN_LENGTH) {
      setReferralStatus(null)
      return
    }

    setIsValidatingReferral(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, VALIDATION_DELAYS.REFERRAL_CHECK))

    if (VALID_REFERRAL_CODES.includes(code.toUpperCase()) || code.length >= 6) {
      setReferralStatus('valid')
    } else {
      setReferralStatus('invalid')
    }

    setIsValidatingReferral(false)
  }

  const handleCodeChange = (code: string) => {
    const formattedCode = code.toUpperCase().replace(/[^A-Z0-9-_]/g, '')
    setCustomCode(formattedCode)
    checkCodeAvailability(formattedCode)
  }

  const handleReferralChange = (code: string) => {
    const formattedCode = code.toUpperCase().replace(/[^A-Z0-9-_]/g, '')
    setReferralCode(formattedCode)
    validateReferralCode(formattedCode)
  }

  const generateRandomCode = () => {
    const numbers = Math.floor(Math.random() * 999) + 1
    const randomCode = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]}-${numbers}`
    setCustomCode(randomCode)
    checkCodeAvailability(randomCode)
  }

  return {
    // State
    activeTab,
    setActiveTab,
    customCode,
    setCustomCode,
    isCheckingCode,
    codeStatus,
    referralCode,
    setReferralCode,
    isValidatingReferral,
    referralStatus,
    userStats,
    recentReferrals,

    // Actions
    handleCodeChange,
    handleReferralChange,
    generateRandomCode,
  }
}
