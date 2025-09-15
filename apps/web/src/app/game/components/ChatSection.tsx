import {
  Channel as ChannelComponent,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Window,
  Thread, // List of user's channels/conversations
} from 'stream-chat-react'
import { useEffect, useState } from 'react'
import { Channel } from 'stream-chat'
import { useChat } from '@/hooks/api/use-chat'

import 'stream-chat-react/dist/css/v2/index.css'
import { useGameData } from '../hooks/useGameData'
export default function ChatsSection() {
  const { lobby } = useGameData()

  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)
  const { client, getChannels, isConnectedToClient, getChannel } = useChat()

  useEffect(() => {
    getChannels()
  }, [getChannels])

  useEffect(() => {
    if (lobby) {
      const fetchChannel = async () => {
        const channel = await getChannel(`lobby-${lobby.id}`)
        setActiveChannel(channel)
      }
      fetchChannel()
    }
  }, [lobby, getChannel])

  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
          <span className="text-lg">💬</span>
        </span>
        Chat
      </h3>
      <div className="space-y-4">
        {isConnectedToClient && (
          <div style={{ display: 'flex', height: '100vh' }}>
            <Chat client={client}>
              {/* Main chat area */}
              <div style={{ flex: 1 }}>
                {activeChannel ? (
                  <ChannelComponent channel={activeChannel}>
                    <Window>
                      <ChannelHeader />
                      <MessageList />
                      <MessageInput />
                    </Window>
                    <Thread />
                  </ChannelComponent>
                ) : (
                  <div className="text-white">Select a conversation</div>
                )}
              </div>
            </Chat>
          </div>
        )}
      </div>
    </div>
  )
}
