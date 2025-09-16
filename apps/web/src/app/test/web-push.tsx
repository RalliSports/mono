'use client'

import { useSessionToken } from '@/hooks/use-session'
import { useState, useEffect } from 'react'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(base64)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

export default function WebPush() {
  const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { session } = useSessionToken()

  // Check if already subscribed on component mount
  useEffect(() => {
    const checkSubscription = async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return
      }

      try {
        const registration = await navigator.serviceWorker.ready
        const existingSubscription = await registration.pushManager.getSubscription()

        if (existingSubscription) {
          setSubscription(existingSubscription)
          setIsSubscribed(true)
        }
      } catch (error) {
        console.error('Error checking subscription:', error)
      }
    }

    checkSubscription()
  }, [])

  const handleToggleSubscription = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push messaging or Service Worker not supported.')
      return
    }

    setLoading(true)

    try {
      if (isSubscribed) {
        // Unsubscribe
        await handleUnsubscribe()
      } else {
        // Subscribe
        await handleSubscribe()
      }
    } catch (error) {
      console.error('Toggle subscription failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    // Request notification permission first
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.warn('Permission for notifications was denied')
      return
    }

    // Register service worker
    await navigator.serviceWorker.register('/sw.js')

    // Wait until the service worker is ready (activated)
    const registration = await navigator.serviceWorker.ready

    // Brave is a bit tricky here ⚡ — push notifications don't always "just work" even if your code is correct.
    // Open brave://settings/privacy → scroll to Background Services. Ensure:
    // "Use Google services for push messaging" is enabled.

    // Subscribe to push
    const subscriptionData = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey as string),
    })

    setSubscription(subscriptionData)
    setIsSubscribed(true)

    // Send subscription to backend
    if (session) {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/subscribe-webpush`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-para-session': session,
        },
        body: JSON.stringify({ payload: subscriptionData.toJSON() }),
      })
    }

    alert('Successfully subscribed to notifications!')
  }

  const handleUnsubscribe = async () => {
    if (!subscription) {
      console.warn('No subscription to unsubscribe from')
      return
    }

    try {
      // Unsubscribe from push manager
      await subscription.unsubscribe()

      // Notify backend about unsubscription
      if (session) {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/unsubscribe-webpush`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-para-session': session,
          },
          body: JSON.stringify({ payload: subscription.toJSON() }),
        })
      }

      setSubscription(null)
      setIsSubscribed(false)
      alert('Successfully unsubscribed from notifications!')
    } catch (error) {
      console.error('Unsubscribe failed:', error)
      throw error
    }
  }

  const handleTestNotification = async () => {
    if (!subscription) {
      alert('Please subscribe first!')
      return
    }

    setLoading(true)

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/test/webpush`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: subscription.toJSON(),
        }),
      })

      setLoading(false)
    } catch (error) {
      console.error('Push test notification failed:', error)
      setLoading(false)
    }
  }

  return (
    <div className="space-x-3">
      <button
        className="bg-background p-4 text-white cursor-pointer"
        onClick={handleToggleSubscription}
        disabled={loading}
      >
        {loading
          ? isSubscribed
            ? 'Unsubscribing...'
            : 'Subscribing...'
          : isSubscribed
            ? 'Unsubscribe from Notifications'
            : 'Subscribe to Notifications'}
      </button>
      {isSubscribed && (
        <button
          className="bg-background p-4 text-white cursor-pointer"
          onClick={handleTestNotification}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send test Notification'}
        </button>
      )}
    </div>
  )
}
