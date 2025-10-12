// Service Worker Version: 1.1
console.log('SW: Service Worker v1.1 loaded')

// ----- PUSH -----
self.addEventListener('push', (event) => {
  if (!event.data) return
  const p = event.data.json()

  // Debug: log the received payload
  console.log('SW: Received push payload:', p)

  // Build options with up to 2 actions (Chrome desktop usually shows max 2)
  const options = {
    body: p.body || '',
    icon: p.icon || '/icon.png',
    badge: p.badge || '/icon.png',
    image: p.image,
    tag: p.tag || self.crypto?.randomUUID?.() || Date.now().toString(),
    requireInteraction: p.requireInteraction ?? true, // keep visible until user acts
    data: {
      // IMPORTANT: send/keep only a PATH so we stay same-origin
      urlPath: p.urlPath || '/join?code=ABC123',
    },
    actions: p.actions ?? [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  }

  // Debug: log the options being used
  console.log('SW: Notification options:', options)

  event.waitUntil(self.registration.showNotification(p.title || 'Invite', options))
})

// ----- CLICK HANDLER (buttons + body clicks) -----
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const action = event.action || 'open' // empty string = body click
  if (action === 'dismiss') {
    // (Optional) track metrics here, then bail
    return
  }

  // Default and 'open' -> open/focus the app at the target path
  const target = new URL(event.notification.data?.urlPath || '/', self.registration.scope).href

  event.waitUntil(
    (async () => {
      const list = await clients.matchAll({ type: 'window', includeUncontrolled: true })

      for (const c of list) {
        if (c.url.startsWith(self.registration.scope)) {
          if ('navigate' in c && c.url !== target) await c.navigate(target)
          await c.focus()
          return
        }
      }
      if (clients.openWindow) await clients.openWindow(target)
    })(),
  )
})

// (Optional) track closes without interaction
self.addEventListener('notificationclose', () => {
  // sendBeacon(...) or postMessage(...) for analytics if you want
})
