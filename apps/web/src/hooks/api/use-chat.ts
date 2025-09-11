'use client'

import { useQuery } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import { useWalletConnection } from '@/app/main/hooks/useWalletConnection'
import { Channel, StreamChat } from 'stream-chat'
import { useCallback, useState } from 'react'
import { useUser } from './use-user'
console.log('stream chat api key', process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY)
const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!)

export function useChat() {
  const api = useApiWithAuth()
  const { currentUser } = useUser()
  const { isConnected } = useWalletConnection(false)
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)

  const currentUserChatToken = useQuery({
    queryKey: ['current-user-chat-token'],
    queryFn: () => api.get<{ token: string }>('/api/get-chat-token'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!isConnected,
  })

  const connectToClient = useCallback(() => {
    console.log('connectToClient', currentUserChatToken.data, currentUser.data)
    if (currentUserChatToken.data && currentUser.data) {
      client.connectUser(
        { id: currentUser.data.id, name: currentUser.data.username!, image: currentUser.data.avatar! },
        currentUserChatToken.data.token,
      )
      console.log('connected to client', client)
    }
  }, [currentUserChatToken.data, currentUser.data])

  const disconnectFromClient = useCallback(() => {
    client.disconnectUser()
  }, [])

  const connectToChannelAndSubscribe = useCallback(
    (channelId: string) => {
      const channel = client.channel('messaging', channelId, {
        members: ['3074aff4-9368-4fb7-8444-8a51b26d275a', '7e570790-6060-4a3b-b648-8b569c5e230c'],
      })
      channel.create()
      channel.on('notification.message_new', (event) => {
        console.log('event', event)
        console.log('received a new message', event.message?.text)
        console.log(`Now have ${channel.state.messages.length} stored in local state`)
      })
      setCurrentChannel(channel)
      console.log('connected to channel', channel)
    },
    [currentUser.data],
  )

  const sendMessageToCurrentChannel = useCallback(
    (message: string) => {
      if (currentChannel) {
        currentChannel.sendMessage({ text: message })
        console.log('sent message to channel', message)
      }
    },
    [currentChannel],
  )

  return {
    currentUserChatToken,
    connectToClient,
    disconnectFromClient,
    connectToChannelAndSubscribe,
    sendMessageToCurrentChannel,
  }
}
