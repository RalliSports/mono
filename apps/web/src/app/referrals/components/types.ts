export interface UserStats {
  totalReferrals: number
  totalEarnings: number
  pendingRewards: number
  activeCode: string
}

export interface Referral {
  id: number
  username: string
  earnings: number
  date: string
  status: 'confirmed' | 'pending'
}

export type CodeStatus = 'available' | 'taken' | 'invalid' | null
export type ReferralStatus = 'valid' | 'invalid' | null
export type ActiveTab = 'create' | 'enter'

export interface TabNavigationProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
}

export interface UserStatsProps {
  userStats: UserStats
}

export interface CustomCodeCreatorProps {
  customCode: string
  setCustomCode: (code: string) => void
  isCheckingCode: boolean
  codeStatus: CodeStatus
  onCodeChange: (code: string) => void
  onGenerateRandom: () => void
}

export interface RecentReferralsProps {
  recentReferrals: Referral[]
}

export interface ReferralCodeInputProps {
  referralCode: string
  setReferralCode: (code: string) => void
  isValidatingReferral: boolean
  referralStatus: ReferralStatus
  onReferralChange: (code: string) => void
}
