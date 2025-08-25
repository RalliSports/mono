// ----- PUSH -----
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const payload = event.data.json()

  const title = payload.title
  const options = {
    body: payload.body || '',
    icon: payload.icon || '/icon.png',
    image: payload.image,
    tag: payload.tag || crypto.randomUUID(),
    data: {
      url: payload.url || 'www.ralli.bet', // deep link when clicked
    },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})
