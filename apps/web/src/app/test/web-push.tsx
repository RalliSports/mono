'use client'

import { useApiWithAuth } from '@/hooks/api'
import { useSessionToken } from '@/hooks/use-session'
import { useState } from 'react'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(base64)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

export default function WebPush() {
  const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription>()
  const api = useApiWithAuth()
  const { session } = useSessionToken()

  const handleSubscribe = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push messaging or Service Worker not supported.')
      return
    }

    setLoading(true)

    try {
      // Request notification permission first
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        console.warn('Permission for notifications was denied')
        setLoading(false)
        return
      }

      // Register service worker
      await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered')

      // Wait until the service worker is ready (activated)
      const registration = await navigator.serviceWorker.ready

      // Brave is a bit tricky here ⚡ — push notifications don’t always “just work” even if your code is correct.
      // Open brave://settings/privacy → scroll to Background Services. Ensure:
      // “Use Google services for push messaging” is enabled.

      // Subscribe to push
      console.log(publicVapidKey, 'publicVapidKey')
      const subscriptionData = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey as string),
      })

      console.log('Push subscription success:', subscriptionData)
      setSubscription(subscriptionData)

      // Send subscription to backend
      if (session) {
        await fetch('http://localhost:4000/api/v1/user/subscribe-webpush', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-para-session': session,
          },
          body: JSON.stringify({ payload: subscriptionData.toJSON() }),
        })
      }

      alert(JSON.stringify(subscriptionData))
    } catch (error) {
      console.error('Push subscription failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTestNotification = async () => {
    if (!subscription) {
      alert('Please subscribe first!')
      return
    }

    setLoading(true)

    try {
      console.log('Sending test notification...')
      const response = await fetch('http://localhost:4000/api/v1/test/webpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: subscription.toJSON(),
        }),
      })

      console.log('Response status:', response.status)
      const result = await response.text()
      console.log('Response body:', result)

      if (response.ok) {
        alert('Test notification sent successfully! Check your notifications.')
      } else {
        alert(`Failed to send notification: ${response.status} - ${result}`)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error sending notification:', error)
      alert(`Error sending notification: ${error}`)
      setLoading(false)
    }
  }

  return (
    <div className="space-x-3">
      <button className="bg-background p-4 text-white cursor-pointer" onClick={handleSubscribe} disabled={loading}>
        {loading ? 'Subscribing...' : 'Subscribe to Notifications'}
      </button>
      <button
        className="bg-background p-4 text-white cursor-pointer"
        onClick={handleTestNotification}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send test Notification'}
      </button>
    </div>
  )
}
