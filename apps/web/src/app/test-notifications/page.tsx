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

export default function TestNotificationsPage() {
  const { session } = useSessionToken()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(false)
  const [sendingTo, setSendingTo] = useState<string | null>(null)
  const [message, setMessage] = useState('Test notification from laptop! 📱')

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

  // Send notification to specific user
  const sendNotificationToUser = async (subscription: Subscription) => {
    setSendingTo(subscription.id)
    setLoading(true)

    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-para-session': session || '',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          title: 'Test Notification',
          body: message,
          url: 'https://www.ralli.bet',
        }),
      })

      if (response.ok) {
        alert(`✅ Notification sent to ${subscription.user?.username || 'user'}!`)
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

  // Send notification to all users
  const sendNotificationToAll = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/send-notification-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-para-session': session || '',
        },
        body: JSON.stringify({
          title: 'Broadcast Notification',
          body: message,
          url: 'https://www.ralli.bet',
        }),
      })

      if (response.ok) {
        alert(`✅ Notification sent to all ${subscriptions.length} users!`)
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Push Notification Test Interface</h1>

        {/* Message Input */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Notification Message</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message..."
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none"
            />
            <button
              onClick={sendNotificationToAll}
              disabled={loading || subscriptions.length === 0}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Sending...' : `Send to All (${subscriptions.length})`}
            </button>
          </div>
        </div>

        {/* Subscriptions List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Subscribed Users ({subscriptions.length})</h2>

          {subscriptions.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              <p>No users have subscribed to push notifications yet.</p>
              <p className="text-sm mt-2">Ask users to visit the test page and subscribe first.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="text-white font-medium">{subscription.user?.username || 'Unknown User'}</div>
                    <div className="text-gray-400 text-sm">{subscription.user?.emailAddress || 'No email'}</div>
                    <div className="text-gray-500 text-xs">
                      Subscribed: {new Date(subscription.createdAt).toLocaleDateString()}
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

        {/* Instructions */}
        <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h3 className="text-blue-400 font-semibold mb-2">How to Test:</h3>
          <ol className="text-blue-300 text-sm space-y-1">
            <li>1. Subscribe to notifications on your phone (visit /test page)</li>
            <li>2. Come back to this page on your laptop</li>
            <li>3. Click "Send Test" next to your subscription</li>
            <li>4. Check your phone for the notification (even if app is closed)</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
