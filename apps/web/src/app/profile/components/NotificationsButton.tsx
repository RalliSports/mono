'use client'

import { useSessionToken } from '@/hooks/use-session'
import { useState, useEffect } from 'react'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(base64)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

export default function NotificationsButton() {
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

  return (
    <button
      className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white"
      onClick={handleToggleSubscription}
      disabled={loading}
      title={isSubscribed ? 'Unsubscribe from notifications' : 'Subscribe to notifications'}
    >
      {loading ? (
        <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        >
          {isSubscribed ? (
            // Notification on icon
            <>
              <g clipPath="url(#clip0_15_159)">
                <path
                  d="M9.5 19C8.89555 19 7.01237 19 5.61714 19C4.87375 19 4.39116 18.2177 4.72361 17.5528L5.57771 15.8446C5.85542 15.2892 6 14.6774 6 14.0564C6 13.2867 6 12.1434 6 11C6 9 7 5 12 5C17 5 18 9 18 11C18 12.1434 18 13.2867 18 14.0564C18 14.6774 18.1446 15.2892 18.4223 15.8446L19.2764 17.5528C19.6088 18.2177 19.1253 19 18.382 19H14.5M9.5 19C9.5 21 10.5 22 12 22C13.5 22 14.5 21 14.5 19M9.5 19C11.0621 19 14.5 19 14.5 19"
                  stroke="currentColor"
                  strokeLinejoin="round"
                />
                <path d="M12 5V3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_15_159">
                  <rect width="24" height="24" fill="transparent" />
                </clipPath>
              </defs>
            </>
          ) : (
            // Notification off icon
            <>
              <g clipPath="url(#clip0_15_166)">
                <path
                  d="M6 15C6 15 6 13 6 11C6 9 7 5 12 5C13.5723 5 14.749 5.39552 15.6235 6M9.5 19C9.5 21 10.5 22 12 22C13.5 22 14.5 21 14.5 19M9.5 19C11.0621 19 14.5 19 14.5 19M9.5 19C9.14909 19 8.36719 19 7.5 19M14.5 19H18.382C19.1253 19 19.6088 18.2177 19.2764 17.5528L18 15C18 15 18 13 18 11C18 10.3755 17.9025 9.55594 17.6161 8.72408"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M12 5V3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 3L3 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_15_166">
                  <rect width="24" height="24" fill="transparent" />
                </clipPath>
              </defs>
            </>
          )}
        </svg>
      )}
    </button>
  )
}
