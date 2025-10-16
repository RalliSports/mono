'use client'

import { useQuery } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import { useWalletConnection } from '@/app/main/hooks/useWalletConnection'
import { Channel, StreamChat } from 'stream-chat'
import { useCallback, useEffect, useState } from 'react'
import { useUser } from './use-user'
console.log('stream chat api key', process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY)
const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!)

export function useChat() {
  const api = useApiWithAuth()
  const { currentUser } = useUser()
  const { isConnected } = useWalletConnection(false)
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)
  const [isConnectedToClient, setIsConnectedToClient] = useState(false)

  const currentUserChatToken = useQuery({
    queryKey: ['current-user-chat-token'],
    queryFn: () => api.get<{ token: string }>('/api/get-chat-token'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!isConnected,
  })

  useEffect(() => {
    if (
      currentUserChatToken.data?.token &&
      currentUser.data?.id &&
      currentUser.data?.username &&
      currentUser.data?.avatar
    ) {
      client.connectUser(
        { id: currentUser.data.id, name: currentUser.data.username!, image: currentUser.data.avatar! },
        currentUserChatToken.data.token,
      )
      console.log('connected to client', client)
      setIsConnectedToClient(true)
    }
  }, [currentUserChatToken.data, currentUser.data])

  const connectToClient = useCallback(() => {
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

  const connectToDirectMessage = useCallback(
    (userId: string) => {
      if (currentUser.data && userId) {
        const channel = client.channel('messaging', null, {
          members: [currentUser.data.id, userId],
        })
        channel.create()

        // Enhanced notification handling for conversation tracking
        channel.on('notification.message_new', (event) => {
          console.log('New message notification event:', event)
          console.log('Message text:', event.message?.text)
          console.log('Channel:', event.channel?.id)
          console.log('Sender:', event.message?.user?.name)
          console.log(`Total messages in channel: ${channel.state.messages.length}`)

          // Track conversation activity for better notification handling
          if (event.message && event.channel) {
            console.log('Conversation updated - Channel ID:', event.channel.id)
            console.log('Last activity timestamp:', new Date().toISOString())
          }
        })

        // Track when user reads messages
        channel.on('message.read', (event) => {
          console.log('Message read event:', event)
          console.log('User read up to:', event.created_at)
        })

        setCurrentChannel(channel)
        console.log('Connected to direct message channel:', channel)
        return channel
      } else {
        console.log('Could not connect to direct message - missing user data')
        throw new Error('could not connect to direct message')
      }
    },
    [currentUser.data],
  )

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

  const getChannels = useCallback(async () => {
    if (currentUser.data) {
      const channels = await client.queryChannels({
        members: { $in: [currentUser.data.id!] },
      })
      console.log('User channels:', channels)
      console.log('Channel count:', channels.length)
      return channels
    }
  }, [client])

  const getChannel = useCallback(async (channelId: string, channelType: 'messaging' | 'gaming' = 'gaming') => {
    try {
      const channel = await client.getChannelById(channelType, channelId, {})
      console.log(`Successfully fetched ${channelType} channel:`, channelId)
      return channel
    } catch (error) {
      console.error(`Failed to fetch ${channelType} channel ${channelId}:`, error)
      throw error
    }
  }, [])

  return {
    currentUserChatToken,
    connectToClient,
    disconnectFromClient,
    connectToChannelAndSubscribe,
    sendMessageToCurrentChannel,
    client,
    getChannels,
    isConnectedToClient,
    getChannel,
    connectToDirectMessage,
  }
}
