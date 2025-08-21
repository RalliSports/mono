'use client'

// Components
import {
  PageHeader,
  TabNavigation,
  UserStats,
  CustomCodeCreator,
  RecentReferrals,
  ReferralCodeInput,
  HowItWorks,
  BackNavigation,
} from './components'

// Hooks
import { useReferrals } from './hooks/useReferrals'

export default function Referrals() {
  const {
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
  } = useReferrals()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Enhanced Header */}
        <PageHeader />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Create Tab */}
        {activeTab === 'create' && (
          <>
            {/* Current Stats */}
            <UserStats userStats={userStats} />

            {/* Create Custom Code */}
            <CustomCodeCreator
              customCode={customCode}
              setCustomCode={setCustomCode}
              isCheckingCode={isCheckingCode}
              codeStatus={codeStatus}
              onCodeChange={handleCodeChange}
              onGenerateRandom={generateRandomCode}
            />

            {/* Recent Referrals */}
            <RecentReferrals recentReferrals={recentReferrals} />
          </>
        )}

        {/* Enter Tab */}
        {activeTab === 'enter' && (
          <>
            <ReferralCodeInput
              referralCode={referralCode}
              setReferralCode={setReferralCode}
              isValidatingReferral={isValidatingReferral}
              referralStatus={referralStatus}
              onReferralChange={handleReferralChange}
            />

            {/* How It Works */}
            <HowItWorks />
          </>
        )}

        {/* Back Navigation */}
        <BackNavigation />
      </div>
    </div>
  )
}
