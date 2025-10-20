"use client"


import { useChat } from '@/hooks/api/use-chat'
import { ProfileTabType } from '../hooks/useProfileTabs'
import { Channel } from 'stream-chat'

interface TabNavigationProps {
  activeTab: ProfileTabType
  setActiveTab: (tab: ProfileTabType) => void
  isCurrentUser: boolean
  userId: string
  setActiveChannel: (channel: Channel | null) => void
  userHasStreamChat: boolean
}

export default function TabNavigation({
  activeTab,
  setActiveTab,
  isCurrentUser,
  userId,
  setActiveChannel,
  userHasStreamChat,
}: TabNavigationProps) {
  const { connectToDirectMessage } = useChat()

  const tabs = [
    { id: 'parlays', name: 'Parlays', icon: '🎯' },
    { id: 'chats', name: 'Chat', icon: '💬' },
    { id: 'friends', name: 'Friends', icon: '👥' },
    // { id: 'history', name: 'History', icon: '📋' },
    // { id: 'achievements', name: 'Achievements', icon: '🏆' },
  ]

  if (!userHasStreamChat && !isCurrentUser) {
    tabs.splice(1, 1)
  }

  return (
    <div className="px-4 ">
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-3 shadow-2xl mb-6">
        <div className="flex  gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'chats' && !isCurrentUser) {
                  const channel = connectToDirectMessage(userId)
                  setActiveChannel(channel)
                }
                setActiveTab(tab.id as ProfileTabType)
              }}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
