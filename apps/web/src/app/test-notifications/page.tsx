'use client'

import { useState, useEffect } from 'react'
import { useSessionToken } from '@/hooks/use-session'

interface Subscription {
  id: string
  userId: string
  subscription: {
    endpoint: string
    keys: {
      p256dh: string
      auth: string
    }
  }
  isActive: boolean
  createdAt: string
  user?: {
    username: string
    emailAddress: string
  }
}

interface NotificationType {
  id: string
  name: string
  title: string
  body: string
  url: string
  description: string
}

const notificationTypes: NotificationType[] = [
  {
    id: 'dm',
    name: 'Direct Message',
    title: 'New Message from John',
    body: 'Hey! Ready for the next game?',
    url: 'https://www.ralli.bet/profile?tab=chats&channel=test-conversation-123',
    description: 'Opens profile chats with specific conversation',
  },
  {
    id: 'group-chat',
    name: 'Group Chat Message',
    title: 'New Message from Sarah',
    body: 'Game starts in 5 minutes! 🎮',
    url: 'https://www.ralli.bet/game?id=test-game-456&tab=chats',
    description: 'Opens game page with chat tab active',
  },
  {
    id: 'game-resolved',
    name: 'Game Result',
    title: 'Game Resolved 🎉',
    body: 'Your recent game Lakers vs Warriors has been resolved. Check the results now!',
    url: 'https://www.ralli.bet/game?id=test-game-789',
    description: 'Opens game page to view results',
  },
  {
    id: 'game-invite',
    name: 'Game Invite',
    title: "You've Been Invited to join NBA Finals",
    body: "You have been invited to join a new game, the game code is ABC123. Don't keep them waiting!",
    url: 'https://www.ralli.bet/game?id=test-game-invite-999',
    description: 'Opens game page to join',
  },
  {
    id: 'custom',
    name: 'Custom',
    title: 'Custom Test',
    body: 'Custom message body',
    url: 'https://www.ralli.bet',
    description: 'Custom notification for testing',
  },
]

export default function TestNotificationsPage() {
  const { session } = useSessionToken()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(false)
  const [sendingTo, setSendingTo] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<NotificationType>(notificationTypes[0])
  const [customTitle, setCustomTitle] = useState('')
  const [customBody, setCustomBody] = useState('')
  const [customUrl, setCustomUrl] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())

  // Fetch all subscriptions
  const fetchSubscriptions = async () => {
    if (!session) return

    try {
      const response = await fetch('/api/get-subscriptions', {
        headers: {
          'x-para-session': session,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data)
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    }
  }

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setSelectedUsers(newSelected)
  }

  // Select all users
  const selectAllUsers = () => {
    setSelectedUsers(new Set(subscriptions.map((sub) => sub.userId)))
  }

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedUsers(new Set())
  }

  // Get notification data based on selected type
  const getNotificationData = () => {
    if (selectedType.id === 'custom') {
      return {
        title: customTitle || selectedType.title,
        body: customBody || selectedType.body,
        url: customUrl || selectedType.url,
      }
    }
    return {
      title: selectedType.title,
      body: selectedType.body,
      url: selectedType.url,
    }
  }

  // Send notification to specific user
  const sendNotificationToUser = async (subscription: Subscription) => {
    setSendingTo(subscription.id)
    setLoading(true)

    const notificationData = getNotificationData()

    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-para-session': session || '',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          ...notificationData,
        }),
      })

      if (response.ok) {
        alert(`✅ ${selectedType.name} notification sent to ${subscription.user?.username || 'user'}!`)
      } else {
        alert(`❌ Failed to send notification: ${response.status}`)
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      alert('❌ Error sending notification')
    } finally {
      setLoading(false)
      setSendingTo(null)
    }
  }

  // Send notification to selected users
  const sendNotificationToSelected = async () => {
    if (selectedUsers.size === 0) {
      alert('Please select at least one user')
      return
    }

    setLoading(true)
    const notificationData = getNotificationData()

    try {
      const selectedSubscriptions = subscriptions.filter((sub) => selectedUsers.has(sub.userId))
      const promises = selectedSubscriptions.map((subscription) =>
        fetch('/api/send-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-para-session': session || '',
          },
          body: JSON.stringify({
            subscriptionId: subscription.id,
            ...notificationData,
          }),
        }),
      )

      const results = await Promise.all(promises)
      const successCount = results.filter((r) => r.ok).length
      const failCount = results.length - successCount

      alert(
        `✅ ${selectedType.name} notifications sent to ${successCount} users! ${failCount > 0 ? `(${failCount} failed)` : ''}`,
      )
    } catch (error) {
      console.error('Error sending notifications:', error)
      alert('❌ Error sending notifications')
    } finally {
      setLoading(false)
    }
  }

  // Send notification to all users
  const sendNotificationToAll = async () => {
    setLoading(true)
    const notificationData = getNotificationData()

    try {
      const response = await fetch('/api/send-notification-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-para-session': session || '',
        },
        body: JSON.stringify(notificationData),
      })

      if (response.ok) {
        alert(`✅ ${selectedType.name} notification sent to all ${subscriptions.length} users!`)
      } else {
        alert(`❌ Failed to send notifications: ${response.status}`)
      }
    } catch (error) {
      console.error('Error sending notifications:', error)
      alert('❌ Error sending notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [session])

  useEffect(() => {
    if (selectedType.id === 'custom') {
      setCustomTitle(selectedType.title)
      setCustomBody(selectedType.body)
      setCustomUrl(selectedType.url)
    }
  }, [selectedType])

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Test Notifications</h1>
          <p>Please log in to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Push Notification Test Interface</h1>

        {/* Notification Type Selector */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Notification Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {notificationTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedType.id === type.id
                    ? 'border-cyan-400 bg-cyan-900/20'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="text-white font-medium mb-1">{type.name}</div>
                <div className="text-gray-400 text-sm">{type.description}</div>
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Preview:</h3>
            <div className="text-cyan-400 font-medium">{getNotificationData().title}</div>
            <div className="text-gray-300 text-sm mb-2">{getNotificationData().body}</div>
            <div className="text-gray-400 text-xs">URL: {getNotificationData().url}</div>
          </div>
        </div>

        {/* Custom Notification Fields */}
        {selectedType.id === 'custom' && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Custom Notification</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Notification title..."
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Body</label>
                <textarea
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  placeholder="Notification message..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white mb-2">URL</label>
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://www.ralli.bet/..."
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Send Actions */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Send Notifications</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={sendNotificationToSelected}
              disabled={loading || selectedUsers.size === 0}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              Send to Selected ({selectedUsers.size})
            </button>
            <button
              onClick={sendNotificationToAll}
              disabled={loading || subscriptions.length === 0}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              Send to All ({subscriptions.length})
            </button>
          </div>
        </div>

        {/* User Selection */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Subscribed Users ({subscriptions.length})</h2>
            <div className="flex gap-2">
              <button
                onClick={selectAllUsers}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
              >
                Select All
              </button>
              <button
                onClick={clearAllSelections}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {subscriptions.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              <p>No users have subscribed to push notifications yet.</p>
              <p className="text-sm mt-2">Ask users to visit the test page and subscribe first.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(subscription.userId)}
                      onChange={() => toggleUserSelection(subscription.userId)}
                      className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">{subscription.user?.username || 'Unknown User'}</div>
                      <div className="text-gray-400 text-sm">{subscription.user?.emailAddress || 'No email'}</div>
                      <div className="text-gray-500 text-xs">
                        Subscribed: {new Date(subscription.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        subscription.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}
                    >
                      {subscription.isActive ? 'Active' : 'Inactive'}
                    </span>

                    <button
                      onClick={() => sendNotificationToUser(subscription)}
                      disabled={loading || sendingTo === subscription.id}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {sendingTo === subscription.id ? 'Sending...' : 'Send Test'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
