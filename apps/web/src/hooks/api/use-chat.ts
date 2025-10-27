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
      const connectUser = async () => {
        try {
          await client.connectUser(
            {
              id: currentUser.data!.id,
              name: currentUser.data!.username!,
              image: currentUser.data!.avatar!,
            },
            currentUserChatToken.data!.token,
          )
          console.log('Successfully connected to Stream.io client', client)
          setIsConnectedToClient(true)
        } catch (error) {
          console.error('Failed to connect to Stream.io client:', error)
          setIsConnectedToClient(false)
        }
      }

      connectUser()
    }
  }, [currentUserChatToken.data, currentUser.data])

  const connectToClient = useCallback(async () => {
    if (currentUserChatToken.data && currentUser.data) {
      try {
        await client.connectUser(
          { id: currentUser.data.id, name: currentUser.data.username!, image: currentUser.data.avatar! },
          currentUserChatToken.data.token,
        )
        console.log('connected to client', client)
        setIsConnectedToClient(true)
        return true
      } catch (error) {
        console.error('Failed to connect to client:', error)
        setIsConnectedToClient(false)
        return false
      }
    }
    return false
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
        channel.on('notification.message_new', (event) => {
          console.log('event', event)
          console.log('received a new message', event.message?.text)
          console.log(`Now have ${channel.state.messages.length} stored in local state`)
        })
        setCurrentChannel(channel)
        console.log('connected to channel', channel)
        return channel
      } else {
        console.log('could not connect to direct message')
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
      try {
        console.log('🔍 Querying channels for user:', currentUser.data.id)
        const channels = await client.queryChannels({
          members: { $in: [currentUser.data.id!] },
        })
        console.log('✅ User channels:', channels)
        console.log('📊 Channel count:', channels.length)
        return channels
      } catch (error) {
        console.error('❌ Failed to query channels:', error)
        return []
      }
    }
    console.warn('⚠️ No current user data available for channel query')
    return []
  }, [client, currentUser.data])

  const getChannel = useCallback(async (channelId: string) => {
    const channel = await client.getChannelById('gaming', channelId, {})
    return channel
  }, [])

  const ensureConnection = useCallback(async (): Promise<boolean> => {
    if (isConnectedToClient) {
      return true
    }

    if (currentUserChatToken.data && currentUser.data?.id && currentUser.data?.username && currentUser.data?.avatar) {
      try {
        await client.connectUser(
          {
            id: currentUser.data.id,
            name: currentUser.data.username,
            image: currentUser.data.avatar,
          },
          currentUserChatToken.data.token,
        )
        setIsConnectedToClient(true)
        return true
      } catch (error) {
        console.error('Failed to ensure Stream.io connection:', error)
        return false
      }
    }

    return false
  }, [isConnectedToClient, currentUserChatToken.data, currentUser.data, client])

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
    ensureConnection,
  }
}
