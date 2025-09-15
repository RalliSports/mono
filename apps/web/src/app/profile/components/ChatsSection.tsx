import {
  Channel as ChannelComponent,
  ChannelHeader,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  Window,
  ChannelPreviewUIComponentProps,
  Thread, // List of user's channels/conversations
} from 'stream-chat-react'
import { useProfile } from '../hooks/useProfile'
import { useSessionToken } from '@/hooks/use-session'
import { useEffect, useState } from 'react'
import { Channel, ChannelFilters } from 'stream-chat'
import { useChat } from '@/hooks/api/use-chat'
import Image from 'next/image'

import 'stream-chat-react/dist/css/v2/index.css'
export default function ChatsSection() {
  const { session } = useSessionToken()
  const { user } = useProfile(session || null)
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)
  const { client, getChannels, isConnectedToClient } = useChat()
  useEffect(() => {
    getChannels()
  }, [getChannels])

  const filters = {
    type: { $in: ['messaging', 'team', 'gaming'] },
    members: { $in: [user?.id] },
  }

  //   const sort = [{ last_message_at: -1 }]
  const CustomChannelPreview = (props: ChannelPreviewUIComponentProps) => {
    const { channel, latestMessagePreview, unread, displayImage } = props
    const channelName = channel.data?.name
    const handleChannelClick = () => {
      setActiveChannel(channel)
    }

    return (
      <div
        className={`channel-preview ${activeChannel?.id === channel.id ? 'active' : ''}`}
        onClick={handleChannelClick}
        style={{
          padding: '12px',
          borderBottom: '1px solid #eee',
          cursor: 'pointer',
          backgroundColor: activeChannel?.id === channel.id ? '#f0f0f0' : 'white',
        }}
      >
        <div className="channel-info">
          <Image src={displayImage || '/images/pfp-1.svg'} alt={channelName || 'Channel'} width={32} height={32} />
          <strong>{channelName || 'Direct Message'}</strong>
          {unread && unread > 0 && <span className="unread-count">({unread})</span>}
          <div style={{ fontSize: '12px', color: '#666' }}>{latestMessagePreview || 'No messages yet'}</div>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
          <span className="text-lg">💬</span>
        </span>
        Chats
      </h3>
      <div className="space-y-4">
        {isConnectedToClient && (
          <div style={{ display: 'flex', height: '100vh' }}>
            <Chat client={client}>
              {/* Left sidebar - Channel List */}
              <div style={{ width: '300px', borderRight: '1px solid #ddd' }}>
                <ChannelList
                  filters={filters as ChannelFilters}
                  // sort={sort}
                  // onChannelSelect={setActiveChannel}
                  Preview={(props) => <CustomChannelPreview {...props} />} // Optional custom preview
                />
              </div>

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
