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
import { useScreenSize } from '@/hooks/useScreenSize'

import 'stream-chat-react/dist/css/v2/index.css'

// Custom styles to integrate with our design
const customChatStyles = `
  .custom-chat-container .str-chat {
    background: transparent;
    height: 100%;
  }
  
  .custom-chat-container .str-chat__channel-list {
    background: transparent;
  }
  
  .custom-chat-container .str-chat__main-panel {
    background: rgba(30, 41, 59, 0.8) !important;
    backdrop-filter: blur(12px) !important;
    border-radius: 0 16px 16px 0;
  }
  
  .custom-chat-container .str-chat__message-list {
    background: #0f172a !important;
    padding: 16px !important;
  }
  
  .custom-chat-container .str-chat__message-list-scroll {
    background: #0f172a !important;
  }
  
  .custom-chat-container .str-chat__main-panel {
    background: #0f172a !important;
  }
  
  .custom-chat-container .str-chat__channel {
    background: #0f172a !important;
  }

  /* Manually target main container components */
  .custom-chat-container .str-chat__main-panel {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__window {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__thread {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__channel-header {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__virtual-message-list {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__message-list-wrapper {
    background: #0f172a !important;
  }

  /* Add more container components */
  .custom-chat-container .str-chat__main-panel-inner {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__channel-inner {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__window-wrapper {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__message-list-container {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__thread-container {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__virtual-list {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__channel-component {
    background: #0f172a !important;
  }

  /* Add more potential components */
  .custom-chat-container .str-chat__loading {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__list {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__header {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__container {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__wrapper {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__content {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__panel {
    background: #0f172a !important;
  }

  /* Style timestamp divider lines */
  .custom-chat-container .str-chat__date-separator {
    background: transparent !important;
    border: none !important;
  }

  .custom-chat-container .str-chat__date-separator-line {
    border-color: rgba(100, 116, 139, 0.3) !important;
    opacity: 0.5 !important;
  }

  .custom-chat-container .str-chat__date-separator-date {
    background: rgba(15, 23, 42, 0.9) !important;
    color: rgba(148, 163, 184, 0.8) !important;
    font-size: 12px !important;
    padding: 4px 12px !important;
    border-radius: 12px !important;
    border: 1px solid rgba(100, 116, 139, 0.2) !important;
  }

  /* Fix hover colors for message action buttons (reactions, thread, etc.) */
  .custom-chat-container .str-chat__message-actions button:hover {
    background: rgba(0, 206, 209, 0.2) !important;
    border-color: rgba(0, 206, 209, 0.4) !important;
    color: rgb(0, 206, 209) !important;
  }

  .custom-chat-container .str-chat__message-action:hover {
    background: rgba(0, 206, 209, 0.2) !important;
    border-color: rgba(0, 206, 209, 0.4) !important;
  }

  .custom-chat-container [data-testid="message-action"]:hover {
    background: rgba(0, 206, 209, 0.2) !important;
    border-color: rgba(0, 206, 209, 0.4) !important;
  }

  .custom-chat-container .str-chat__message-simple__actions button:hover {
    background: rgba(0, 206, 209, 0.2) !important;
    border-color: rgba(0, 206, 209, 0.4) !important;
  }

  /* Fix thread panel background */
  .custom-chat-container .str-chat__thread {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__thread-container {
    background: #0f172a !important;
  }

  .custom-chat-container .str-chat__thread-header {
    background: #0f172a !important;
    border-bottom: 1px solid rgba(0, 206, 209, 0.3) !important;
    color: white !important;
    padding: 16px !important;
  }

  .custom-chat-container .str-chat__thread-header h3 {
    color: white !important;
  }

  /* Make thread close button (X) white - more aggressive */
  .custom-chat-container .str-chat__thread-header button * {
    color: white !important;
    fill: white !important;
    stroke: white !important;
  }

  .custom-chat-container .str-chat__thread-header [role="button"] {
    color: white !important;
  }

  .custom-chat-container .str-chat__thread-header [role="button"] * {
    color: white !important;
    fill: white !important;
  }

  /* Fix reactions background and selector */
  .custom-chat-container .str-chat__reaction-list {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 12px !important;
    backdrop-filter: blur(8px) !important;
  }

  .custom-chat-container .str-chat__reaction {
    background: rgba(51, 65, 85, 0.8) !important;
    border: 1px solid rgba(0, 206, 209, 0.2) !important;
    color: white !important;
  }

  .custom-chat-container .str-chat__reaction:hover {
    background: rgba(0, 206, 209, 0.2) !important;
    border-color: rgba(0, 206, 209, 0.4) !important;
  }

  /* Fix reaction selector popup */
  .custom-chat-container .str-chat__reaction-selector {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 12px !important;
    backdrop-filter: blur(12px) !important;
  }

  .custom-chat-container .str-chat__reaction-selector-emoji {
    background: transparent !important;
  }

  .custom-chat-container .str-chat__reaction-selector-emoji:hover {
    background: rgba(0, 206, 209, 0.2) !important;
    border-radius: 6px !important;
  }

  /* Fix emoji picker and other popups - more aggressive */
  .str-chat__emoji-picker {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 12px !important;
    backdrop-filter: blur(12px) !important;
  }

  .str-chat__reaction-selector {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 12px !important;
    backdrop-filter: blur(12px) !important;
  }

  /* Target the actual emoji picker components */
  .emoji-mart {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 12px !important;
  }

  .emoji-mart-bar {
    background: rgba(30, 41, 59, 0.9) !important;
    border-color: rgba(0, 206, 209, 0.3) !important;
  }

  .emoji-mart-category {
    background: transparent !important;
  }

  /* More emoji picker components */
  .emoji-mart-scroll {
    background: transparent !important;
  }

  .emoji-mart-search input {
    background: rgba(30, 41, 59, 0.9) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    color: white !important;
  }

  .emoji-mart-category-label {
    background: rgba(30, 41, 59, 0.9) !important;
    color: white !important;
  }

  .emoji-mart-emoji:hover {
    background: rgba(0, 206, 209, 0.2) !important;
  }

  /* Stream Chat specific emoji components */
  .str-chat__emoji-picker-container {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 12px !important;
  }

  .str-chat__emoji-picker-wrapper {
    background: rgba(15, 23, 42, 0.95) !important;
  }

  /* Try specific emoji picker selectors */
  .str-chat__emoji-picker-content {
    background: rgba(15, 23, 42, 0.95) !important;
  }

  .str-chat__emoji-picker-body {
    background: rgba(15, 23, 42, 0.95) !important;
  }

  .str-chat__emoji-picker-panel {
    background: rgba(15, 23, 42, 0.95) !important;
  }

  .str-chat__emoji-picker-dropdown {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
  }

  .str-chat__message-input-emoji-picker {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
  }

  /* Try common emoji picker library classes */
  .emoji-picker-react {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 12px !important;
  }

  .EmojiPickerReact {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
  }

  .epr-main {
    background: rgba(15, 23, 42, 0.95) !important;
  }

  .epr-body {
    background: rgba(15, 23, 42, 0.95) !important;
  }

  .epr-search-container {
    background: rgba(30, 41, 59, 0.9) !important;
  }

  .epr-search {
    background: rgba(30, 41, 59, 0.9) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    color: white !important;
  }

  /* Fix tooltip and popup backgrounds */
  .custom-chat-container .str-chat__tooltip {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    color: white !important;
    border-radius: 8px !important;
    backdrop-filter: blur(8px) !important;
  }

  /* Fix general action elements with better borders */
  .custom-chat-container .str-chat__message-actions {
    background: rgba(15, 23, 42, 0.95) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 8px !important;
    backdrop-filter: blur(8px) !important;
  }

  .custom-chat-container .str-chat__message-input {
    background: rgba(30, 41, 59, 0.9) !important;
    border-top: 2px solid rgba(100, 116, 139, 0.3) !important;
    backdrop-filter: blur(12px) !important;
    padding: 20px !important;
  }
  
  .custom-chat-container .str-chat__message-input__wrapper {
    background: rgba(51, 65, 85, 0.9) !important;
    border: 2px solid rgba(100, 116, 139, 0.4) !important;
    border-radius: 16px !important;
    backdrop-filter: blur(8px) !important;
    padding: 12px 16px !important;
  }
  
  .custom-chat-container .str-chat__message-input__wrapper:focus-within {
    border-color: rgba(0, 206, 209, 0.8) !important;
    box-shadow: 0 0 0 4px rgba(0, 206, 209, 0.15) !important;
    background: rgba(51, 65, 85, 0.95) !important;
  }
  
  .custom-chat-container .str-chat__message-input-inner {
    color: white !important;
    background: transparent !important;
    font-size: 14px !important;
    padding: 8px 0 !important;
  }
  
  .custom-chat-container .str-chat__message-input-inner::placeholder {
    color: rgb(148, 163, 184) !important;
  }
  
  .custom-chat-container .str-chat__textarea__textarea {
    color: white !important;
    background: transparent !important;
    resize: none !important;
  }
  
  .custom-chat-container .str-chat__file-input-button {
    background: rgba(0, 206, 209, 0.2) !important;
    border: 2px solid rgba(0, 206, 209, 0.3) !important;
    border-radius: 12px !important;
    color: rgb(0, 206, 209) !important;
    backdrop-filter: blur(4px) !important;
    padding: 8px !important;
    transition: all 0.3s ease !important;
  }
  
  .custom-chat-container .str-chat__file-input-button:hover {
    background: rgba(0, 206, 209, 0.3) !important;
    border-color: rgba(0, 206, 209, 0.5) !important;
    transform: scale(1.05) !important;
  }
  

  
  .custom-chat-container .str-chat__message-simple__content {
    background: rgba(51, 65, 85, 0.9) !important;
    border: 1px solid rgba(100, 116, 139, 0.3) !important;
    border-radius: 16px !important;
    backdrop-filter: blur(8px) !important;
    padding: 12px 16px !important;
    margin: 4px 0 !important;
  }
  
  .custom-chat-container .str-chat__message-simple__text {
    color: white !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
  }
  
  .custom-chat-container .str-chat__message-simple__text__inner p {
    color: white !important;
    margin: 0 !important;
  }
  
  .custom-chat-container .str-chat__avatar-image {
    border: 2px solid rgba(100, 116, 139, 0.3) !important;
    border-radius: 50% !important;
  }
  
  .custom-chat-container .str-chat__message-team__content {
    background: rgba(0, 206, 209, 0.15) !important;
    border: 1px solid rgba(0, 206, 209, 0.4) !important;
    border-radius: 16px !important;
  }
  
  .custom-chat-container .str-chat__message-team .str-chat__message-simple__text {
    color: rgb(0, 206, 209) !important;
  }
  
  .custom-chat-container .str-chat__message-simple__content--received {
    background: rgba(51, 65, 85, 0.9) !important;
  }
  
  .custom-chat-container .str-chat__message-simple__content--sent {
    background: rgba(0, 206, 209, 0.2) !important;
    border: 1px solid rgba(0, 206, 209, 0.3) !important;
  }
  
  .custom-chat-container .str-chat__message-simple__content--sent .str-chat__message-simple__text {
    color: rgb(0, 206, 209) !important;
  }
  
  .custom-chat-container .str-chat__message-simple__content--sent .str-chat__message-simple__text__inner p {
    color: rgb(0, 206, 209) !important;
  }
  
  .custom-chat-container .str-chat__message-timestamp {
    color: rgb(148, 163, 184) !important;
    font-size: 11px !important;
  }
`

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

  if (channels.length === 0) {
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
            <p className="text-slate-400 text-xs truncate">{latestMessagePreview || 'No messages yet'}</p>
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
                      <ChannelList
                        filters={filters as ChannelFilters}
                        Preview={(props) => <CustomChannelPreview {...props} />}
                      />
                    </div>
                  </div>
                )}

                {/* Main Chat */}
                <div className="flex-1">
                  {activeChannel && (!isMobile || (isMobile && hideChannelList)) ? (
                    <ChannelComponent channel={activeChannel}>
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
                          Choose a conversation from the sidebar to start chatting
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
                <p className="text-slate-400">Connecting to chat...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
