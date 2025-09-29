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
  ChannelHeaderProps,
  useTranslationContext,
  useChannelPreviewInfo, // List of user's channels/conversations
  Avatar as DefaultAvatar,
} from 'stream-chat-react'
import { useProfile } from '../hooks/useProfile'
import { useSessionToken } from '@/hooks/use-session'
import { useEffect, useState } from 'react'
import { Channel, ChannelFilters } from 'stream-chat'
import { useChat } from '@/hooks/api/use-chat'
import Image from 'next/image'

import 'stream-chat-react/dist/css/v2/index.css'
import { useScreenSize } from '@/hooks/useScreenSize'
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
  const [hideChannelList, setHideChannelList] = useState(false)
  const { client, getChannels, isConnectedToClient } = useChat()
  const isMobile = useScreenSize()

  useEffect(() => {
    getChannels().then((channels) => {
      setChannels(channels ?? [])
    })
  }, [getChannels])
  if (!user) {
    return <div className="text-white">Loading...</div>
  }

  const filters = {
    type: { $in: ['messaging', 'team', 'gaming'] },
    members: { $in: [user.id] },
  }

  if (channels.length === 0) {
    return <div className="text-white">No channels found. Join a game to start chatting!</div>
  }

  const CustomChannelHeader = (props: ChannelHeaderProps) => {
    const { Avatar = DefaultAvatar, image: overrideImage, live, title: overrideTitle } = props

    const { channel, watcher_count } = useChannelStateContext('ChannelHeader')
    const { t } = useTranslationContext('ChannelHeader')
    const { displayImage, displayTitle, groupChannelDisplayInfo } = useChannelPreviewInfo({
      channel,
      overrideImage,
      overrideTitle,
    })

    const { member_count } = channel?.data || {}

    return (
      <div className="str-chat__channel-header">
        <button onClick={() => setHideChannelList(false)}>◀ Back</button>
        <Avatar
          className="str-chat__avatar--channel-header"
          groupChannelDisplayInfo={groupChannelDisplayInfo}
          image={displayImage}
          name={displayTitle}
        />
        <div className="str-chat__channel-header-end">
          <p className="str-chat__channel-header-title">
            {displayTitle} {live && <span className="str-chat__header-livestream-livelabel">{t('live')}</span>}
          </p>
          <p className="str-chat__channel-header-info">
            {!live && !!member_count && member_count > 0 && (
              <>
                {t('{{ memberCount }} members', {
                  memberCount: member_count,
                })}
                ,{' '}
              </>
            )}
            {t('{{ watcherCount }} online', { watcherCount: watcher_count })}
          </p>
        </div>
      </div>
    )
  }

  //   const sort = [{ last_message_at: -1 }]
  const CustomChannelPreview = (props: ChannelPreviewUIComponentProps) => {
    const { channel, latestMessagePreview, unread, displayImage } = props
    const channelName = channel.data?.name
    const handleChannelClick = () => {
      setHideChannelList(true)
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
              {isCurrentUser && (!isMobile || (isMobile && !hideChannelList)) && (
                <div style={{ width: '300px', borderRight: '1px solid #ddd' }}>
                  <div className="bg-white p-2 text-xl"> Select a conversation</div>
                  <ChannelList
                    filters={filters as ChannelFilters}
                    // sort={sort}
                    // onChannelSelect={setActiveChannel}
                    Preview={(props) => <CustomChannelPreview {...props} />} // Optional custom preview
                  />
                </div>
              )}

              {/* Main chat area */}
              <div style={{ flex: 1 }}>
                {activeChannel && (!isMobile || (isMobile && hideChannelList)) && (
                  <ChannelComponent channel={activeChannel}>
                    <Window>
                      <CustomChannelHeader />

                      <MessageList />
                      <MessageInput />
                    </Window>
                    <Thread />
                  </ChannelComponent>
                )}
              </div>
            </Chat>
          </div>
        )}
      </div>
    </div>
  )
}
