import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { z } from 'zod'

const f = createUploadthing()

export const uploadRouter = {
  profilePicture: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .input(z.object({ sessionId: z.string() }))
    .middleware(async ({ input }) => {
      // Get the session from input
      const sessionId = (input as { sessionId: string }).sessionId

      if (!sessionId) {
        throw new Error('Session ID missing')
      }

      // Validate session and get user info from your backend
      try {
        const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL
        const response = await fetch(`${backendUrl}/api/v1/current-user`, {
          headers: {
            'x-para-session': sessionId,
          },
        })

        if (!response.ok) {
          throw new Error('Invalid session')
        }

        const user = await response.json()
        return { userId: user.id, sessionId }
      } catch {
        throw new Error('Authentication failed')
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs on your server after upload

      // Update the user's avatar in the database
      try {
        const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL
        const response = await fetch(`${backendUrl}/api/v1/update-user`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-para-session': metadata.sessionId,
          },
          body: JSON.stringify({ avatar: file.url }),
        })

        if (!response.ok) {
          throw new Error('Failed to update user avatar')
        }
      } catch (error) {
        console.error('Error updating user avatar:', error)
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof uploadRouter
