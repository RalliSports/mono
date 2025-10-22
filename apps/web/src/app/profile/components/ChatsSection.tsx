import {
  Channel as ChannelComponent,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  Window,
  ChannelPreviewUIComponentProps,
  Thread,
  useChannelStateContext,
} from 'stream-chat-react'
import { useProfile } from '../hooks/useProfile'
import { useSessionToken } from '@/hooks/use-session'
import { useEffect, useState } from 'react'
import { Channel, ChannelFilters } from 'stream-chat'
import { useChat } from '@/hooks/api/use-chat'
import Image from 'next/image'
import { useScreenSize } from '@/hooks/useScreenSize'

import 'stream-chat-react/dist/css/v2/index.css'

import { customChatStyles } from '@/styles/chat'

export default function ChatsSection({
  activeChannel,
  setActiveChannel,
  isCurrentUser,
}: {
  activeChannel: Channel | null
  setActiveChannel: (channel: Channel | null) => void
  isCurrentUser: boolean
}) {
  const { session } = useSessionToken()
  const { user } = useProfile(session || null)
  const [channels, setChannels] = useState<Channel[]>([])
  const [hideChannelList, setHideChannelList] = useState(!isCurrentUser)
  const { client, getChannels, isConnectedToClient, ensureConnection } = useChat()
  const isMobile = useScreenSize()
  const [isInitializing, setIsInitializing] = useState(false)

  useEffect(() => {
    if (isConnectedToClient && user?.id) {
      console.log('🔄 Fetching channels for user:', user.id)
      getChannels()
        .then((channels) => {
          console.log('📥 Received channels:', channels?.length || 0)
          setChannels(channels ?? [])
        })
        .catch((error) => {
          console.error('❌ Error fetching channels:', error)
          setChannels([])
        })
    }
  }, [getChannels, isConnectedToClient, user?.id])

  // Auto-select the active channel when it's provided (e.g., from notification deep link)
  useEffect(() => {
    if (activeChannel) {
      // Ensure the channel list includes the active channel if we have channels
      if (channels.length > 0) {
        const channelExists = channels.some((ch) => ch.id === activeChannel.id)
        if (!channelExists) {
          // Add the channel to the list if it's not already there
          setChannels((prev) => [activeChannel, ...prev])
        }
      }
      // Set mobile view to show the channel on small screens when activeChannel is set
      if (isMobile) {
        setHideChannelList(true)
      }
    }
  }, [activeChannel, channels, isMobile])

  // Force hide channel list on mobile when we have an active channel from deep link
  useEffect(() => {
    if (activeChannel && isMobile && !hideChannelList) {
      setHideChannelList(true)
    }
  }, [activeChannel, isMobile, hideChannelList])

  // Proactively ensure Stream.io connection when we have an activeChannel but not connected
  useEffect(() => {
    if (activeChannel && !isConnectedToClient && user?.id && !isInitializing) {
      console.log('📡 Proactively ensuring Stream.io connection for activeChannel:', activeChannel.id)
      setIsInitializing(true)
      ensureConnection()
        .then((connected) => {
          console.log('📡 Proactive connection result:', connected)
          setIsInitializing(false)
        })
        .catch((error) => {
          console.error('📡 Proactive connection failed:', error)
          setIsInitializing(false)
        })
    }
  }, [activeChannel, isConnectedToClient, user?.id, ensureConnection, isInitializing])

  console.log('💬 ChatsSection render state:', {
    activeChannel: activeChannel?.id,
    channelsCount: channels.length,
    isConnectedToClient,
    userLoaded: !!user,
    isMobile,
    hideChannelList,
    isCurrentUser,
  })

  if (!user) {
    return (
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/10 rounded-lg flex items-center justify-center border border-[#00CED1]/30">
            <span className="text-lg">💬</span>
          </div>
          <div>
            <h3 className="text-white font-bold">Messages</h3>
            <p className="text-slate-400 text-xs">Loading your profile...</p>
          </div>
        </div>
        <div className="animate-pulse bg-slate-700/50 rounded-lg h-32"></div>
      </div>
    )
  }

  const filters = {
    type: { $in: ['messaging', 'team', 'gaming'] },
    members: { $in: [user.id] },
  }

  if (channels.length === 0 && !activeChannel) {
    return (
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/10 rounded-lg flex items-center justify-center border border-[#00CED1]/30">
            <span className="text-lg">💬</span>
          </div>
          <div>
            <h3 className="text-white font-bold">Messages</h3>
            <p className="text-slate-400 text-xs">Your conversations will appear here</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30 text-center">
          <div className="text-slate-400 mb-2">No conversations yet</div>
          <div className="text-slate-500 text-sm">Join a game to start chatting with other players!</div>
        </div>
      </div>
    )
  }

  const CustomChannelHeader = () => {
    const { channel } = useChannelStateContext('ChannelHeader')
    const channelName = channel?.data?.name || 'Direct Message'

    return (
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border-b border-slate-700/50 p-4 flex items-center space-x-3">
        {isMobile && (
          <button
            onClick={() => setHideChannelList(false)}
            className="text-[#00CED1] hover:text-[#00CED1]/80 transition-colors duration-200 font-medium mr-2"
          >
            ← Back
          </button>
        )}
        <div className="w-10 h-10 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/10 rounded-full flex items-center justify-center border border-[#00CED1]/30">
          <span className="text-lg">💬</span>
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-lg">{channelName}</p>
          <p className="text-slate-400 text-sm">Active conversation</p>
        </div>
      </div>
    )
  }

  //   const sort = [{ last_message_at: -1 }]
  const CustomChannelPreview = (props: ChannelPreviewUIComponentProps) => {
    const { channel, latestMessagePreview, displayImage } = props
    // Explicitly don't use the unread prop to avoid any "0" rendering
    const channelName = channel.data?.name || 'Direct Message'
    const handleChannelClick = () => {
      setHideChannelList(true)
      setActiveChannel(channel)
    }

    const isActive = activeChannel?.id === channel.id

    return (
      <div
        className={`
          cursor-pointer transition-all duration-300 p-3 mx-2 my-1 rounded-lg
          ${
            isActive
              ? 'bg-gradient-to-r from-[#00CED1]/20 to-blue-500/10 border border-[#00CED1]/30 shadow-lg'
              : 'hover:bg-gradient-to-r hover:from-slate-800/40 hover:to-slate-700/40'
          }
        `}
        onClick={handleChannelClick}
      >
        <div className="flex items-center space-x-3">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-600/30 bg-slate-700">
              <Image
                src={displayImage || '/images/pfp-1.svg'}
                alt={channelName}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm truncate ${isActive ? 'text-[#00CED1]' : 'text-white'}`}>
              {channelName}
            </h4>
            <div className="text-slate-400 text-xs truncate">{latestMessagePreview || 'No messages yet'}</div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customChatStyles }} />
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 border-b border-slate-700/50">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/10 rounded-lg flex items-center justify-center border border-[#00CED1]/30">
            <span className="text-lg">💬</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Messages</h3>
            <p className="text-slate-400 text-xs">Connect with other players</p>
          </div>
        </div>

        {/* Chat Content */}
        <div className="h-[600px] custom-chat-container">
          {isConnectedToClient ? (
            <Chat client={client}>
              <div className="flex h-full">
                {/* Channel List */}
                {isCurrentUser && (!isMobile || (isMobile && !hideChannelList)) && (
                  <div className="w-80 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border-r border-slate-700/50">
                    <div className="p-6 border-b border-slate-700/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/10 rounded-lg flex items-center justify-center border border-[#00CED1]/30">
                          <span className="text-sm">💬</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">Conversations</h4>
                          <p className="text-slate-400 text-xs">Select a chat to continue</p>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-y-auto py-2">
                      {channels.length > 0 ? (
                        <ChannelList
                          filters={filters as ChannelFilters}
                          Preview={(props) => <CustomChannelPreview {...props} />}
                        />
                      ) : (
                        <div className="p-4 text-center text-slate-400 text-sm">Loading conversations...</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Main Chat */}
                <div className="flex-1">
                  {activeChannel && (!isMobile || (isMobile && hideChannelList)) ? (
                    <ChannelComponent channel={activeChannel} key={activeChannel.id}>
                      <Window>
                        <CustomChannelHeader />
                        <MessageList />
                        <MessageInput />
                      </Window>
                      <Thread />
                    </ChannelComponent>
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-700/40 to-slate-800/40">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/10 rounded-2xl flex items-center justify-center border border-[#00CED1]/30 mx-auto mb-4">
                          <span className="text-2xl">💬</span>
                        </div>
                        <h4 className="text-white font-medium mb-2">No conversation selected</h4>
                        <p className="text-slate-400 text-sm">
                          {channels.length === 0
                            ? 'Loading conversations...'
                            : 'Choose a conversation from the sidebar to start chatting'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Chat>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-[#00CED1] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-400">{activeChannel ? 'Loading conversation...' : 'Connecting to chat...'}</p>
                {activeChannel && (
                  <p className="text-slate-500 text-xs mt-2">
                    {isInitializing ? 'Initializing chat connection...' : `Loading channel: ${activeChannel.id}`}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
