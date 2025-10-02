'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { TopNavigation, FilterBar, BalanceDisplay, ProfileButton } from '../../main/components'
import Image from 'next/image'
import OnboardingTutorial from './OnboardingTutorial'

const mockLobbies = [
  {
    id: 1,
    title: 'NBA Night Showdown',
    creator: { username: 'Jordan', avatar: '/images/pfp-1.svg', id: 1 },
    imageUrl: '/images/pfp-1.svg',
    numBets: 3,
    depositAmount: 10,
    maxParticipants: 8,
    participants: ['Jordan', 'Kobe', 'name3', 'name4'],
  },
  {
    id: 2,
    title: 'Premier League Derby',
    creator: { username: 'Mortal', avatar: '/images/pfp-2.svg', id: 2 },
    imageUrl: '/images/pfp-2.svg',
    numBets: 5,
    depositAmount: 5,
    maxParticipants: 10,
    participants: ['Mortal', 'name2', 'name3', 'name4', 'name5', 'name6'],
  },
  {
    id: 3,
    title: 'Soccer Showdown',
    creator: { username: 'ronaldo7', avatar: '/images/pfp-3.svg', id: 3 },
    imageUrl: '/images/pfp-3.svg',
    numBets: 4,
    depositAmount: 20,
    maxParticipants: 6,
    participants: ['ronaldo7', 'messi10', 'neymar11'],
  },
  {
    id: 4,
    title: 'NFL Sunday',
    creator: { username: 'brady12', avatar: '/images/pfp-4.svg', id: 4 },
    imageUrl: '/images/pfp-4.svg',
    numBets: 5,
    depositAmount: 15,
    maxParticipants: 8,
    participants: ['brady12'],
  },
]

function MockLobbyCard({ lobby, tutorialStep }: { lobby: any; tutorialStep?: string }) {
  const router = useRouter()
  // Defensive checks for all fields
  const participantCount = Array.isArray(lobby?.participants) ? lobby.participants.length : 0
  const maxParticipants = typeof lobby?.maxParticipants === 'number' ? lobby.maxParticipants : 1
  const depositAmount = typeof lobby?.depositAmount === 'number' ? lobby.depositAmount : 0
  const progressPercentage = (participantCount / maxParticipants) * 100
  const prizePool = maxParticipants * depositAmount
  const creator = lobby?.creator || {}
  const avatar = typeof creator.avatar === 'string' ? creator.avatar : '/images/pfp-1.svg'
  const username = typeof creator.username === 'string' ? creator.username : 'Unknown'
  const title = typeof lobby?.title === 'string' ? lobby.title : 'Untitled'
  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group hover:transform hover:scale-[1.01] shadow-xl relative min-h-[280px]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#00CED1]/5 via-transparent to-[#FFAB91]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center shadow-lg overflow-hidden">
            <Image src={avatar} alt={username} width={48} height={48} />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1 text-white">
              <span>{username}</span>
              <span className="text-slate-400 text-sm ml-1">created a lobby</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center">{title}</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/60 rounded-xl p-4 border border-slate-600/30">
                <div className="text-center">
                  <div className="text-2xl font-black text-[#00CED1] mb-1">{lobby?.numBets ?? 0}</div>
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Legs</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/60 rounded-xl p-4 border border-slate-600/30">
                <div className="text-center">
                  <div className="text-2xl font-black text-[#FFAB91] mb-1">${depositAmount}</div>
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Buy-in</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/60 rounded-xl p-4 border border-slate-600/30">
                <div className="text-center">
                  <div className="text-2xl font-black text-emerald-400 mb-1">
                    {participantCount}/{maxParticipants}
                  </div>
                  <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Slots</div>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[#00CED1] font-bold text-2xl">${prizePool}</span>
                  <span className="text-slate-400 text-sm ml-2">prize pool</span>
                </div>
                <span className="text-slate-300 text-sm font-semibold">{Math.round(progressPercentage)}% full</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="relative">
            <button
              className={`w-full font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 mt-auto ${
                tutorialStep === 'click-view-button' && lobby.id === 1
                  ? 'bg-yellow-400 text-slate-900 shadow-xl shadow-yellow-400/50 animate-pulse'
                  : 'bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-slate-900 hover:shadow-xl hover:shadow-[#00CED1]/30 transform hover:scale-[1.02]'
              }`}
              onClick={() => {
                if (lobby?.id === 1) router.push('/onboarding/game-1')
                else if (lobby?.id === 2) router.push('/onboarding/game-2')
              }}
            >
              <span>View Lobby</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MockMainPage() {
  const router = useRouter()
  const [tutorialActive, setTutorialActive] = React.useState(true)
  const [tutorialStep, setTutorialStep] = React.useState<string>('explain-lobbies')

  // Mock props for navigation, connection, and balances
  const mockProps = {
    onMenuClick: () => {},
    isConnected: true,
    balances: { ralli: 1234.56 },
    balanceLoading: false,
    balanceError: null,
  }

  const handleTutorialComplete = () => {
    setTutorialActive(false)
  }

  const handleTutorialStepChange = (step: string) => {
    setTutorialStep(step)
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <TopNavigation {...mockProps} />
      {/* <FilterBar /> */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">Open Lobbies</h2>
          <div className="text-[#FFAB91] font-bold text-xl">{mockLobbies.length} Active</div>
        </div>
        <div className="space-y-3 mb-6">
          {mockLobbies.map((lobby, index) => (
            <div key={lobby.id}>
              <MockLobbyCard lobby={lobby} tutorialStep={tutorialStep} />
            </div>
          ))}
        </div>
      </div>

      {/* Tutorial Overlay */}
      <OnboardingTutorial onComplete={handleTutorialComplete} onStepChange={handleTutorialStepChange} />
    </div>
  )
}
