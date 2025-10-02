'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAccount } from '@getpara/react-sdk'
import { useUser } from '@/hooks/api/use-user'
import { UploadButton } from '@/lib/uploadthing'
import { useSessionToken } from '@/hooks/use-session'

export default function Setup() {
  const router = useRouter()
  const account = useAccount()
  const { session } = useSessionToken()
  const { currentUser } = useUser()
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState('/images/pfp-1.svg')
  const usernameRef = useRef<HTMLInputElement | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const userEditedRef = useRef(false)
  const hasNavigatedRef = useRef(false) // Track if we've already navigated

  // Initialize local state from current user data once
  useEffect(() => {
    if (!currentUser.data) return

    // Only seed local state from server data if the user hasn't started editing.
    if (userEditedRef.current) return

    // Seed avatar only; leave username to the uncontrolled input's defaultValue
    if (currentUser.data.avatar) {
      setAvatar(currentUser.data.avatar)
    }
  }, [currentUser.data])

  // Redirect if not connected
  if (!account?.isConnected) {
    if (!hasNavigatedRef.current) {
      hasNavigatedRef.current = true
      router.push('/signin')
    }
    return null
  }

  // Show loading while user data is being fetched
  if (currentUser.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-stone-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CED1] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Skip setup if user has already completed first login setup
  // Only redirect if we're sure the data is fresh (not during/after mutation)
  if (currentUser.data && currentUser.data.isFirstLogin === false && !isSubmitting && !hasNavigatedRef.current) {
    hasNavigatedRef.current = true
    router.push('/main')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const currentUsername = usernameRef?.current?.value ?? username

    if (!currentUsername.trim()) {
      setError('Username is required')
      return
    }

    if (currentUsername.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    if (currentUsername.length > 20) {
      setError('Username must be less than 20 characters')
      return
    }

    // Check for valid username characters
    if (!/^[a-zA-Z0-9_-]+$/.test(currentUsername)) {
      setError('Username can only contain letters, numbers, underscores, and hyphens')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/update-user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-para-session': session || '',
        },
        body: JSON.stringify({
          username: username.trim(),
          avatar: avatar,
          firstName: currentUser.data?.firstName || '',
          lastName: currentUser.data?.lastName || '',
          isFirstLogin: false,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      // Navigate immediately after successful response to prevent race conditions
      router.push('/main')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to update profile. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-stone-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent mb-2">
            Welcome to Ralli!
          </h1>
          <p className="text-gray-600">Let&apos;s set up your profile to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="text-center">
            <Image
              src={avatar}
              alt="Profile picture"
              width={96}
              height={96}
              className="w-24 h-24 rounded-full mx-auto border-4 border-gray-200 object-cover"
              priority
            />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Profile Picture (Optional)</p>
              <UploadButton
                {...({
                  endpoint: "profilePicture",
                  input: { sessionId: session || '' },
                  onClientUploadComplete: (res: { url: string }[]) => {
                    if (res?.[0]?.url) {
                      setAvatar(res[0].url)
                    }
                  },
                  onUploadError: () => {
                    setError('Failed to upload image. Please try again.')
                  },
                  appearance: {
                    button:
                      'bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white text-sm px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 border-none cursor-pointer',
                    allowedContent: 'text-xs text-gray-500 mt-1',
                  }
                } as Record<string, unknown>)}
              />
            </div>
          </div>

          {/* Username Section */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              ref={usernameRef}
              defaultValue={currentUser.data?.username ?? ''}
              onInput={(e) => {
                userEditedRef.current = true
                setUsername((e.target as HTMLInputElement).value)
              }}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CED1] focus:border-transparent"
              maxLength={20}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              3-20 characters, letters, numbers, underscores, and hyphens only
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !username.trim()}
            className="w-full px-8 py-3 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Setting up...
              </div>
            ) : (
              'Continue to Ralli'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
