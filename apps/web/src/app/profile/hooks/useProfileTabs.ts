import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
export type ProfileTabType = 'parlays' | 'chats' | 'friends' | 'history' | 'achievements'

export function useProfileTabs() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTabState] = useState<ProfileTabType>('parlays')
  const [mounted, setMounted] = useState(false)
  const [editingUsername, setEditingUsername] = useState(false)

  // Function to update both state and URL
  const setActiveTab = useCallback(
    (tab: ProfileTabType) => {
      console.log('Setting active tab to:', tab)
      setActiveTabState(tab)

      // Update URL with new tab parameter
      const params = new URLSearchParams(searchParams.toString())
      if (tab === 'parlays') {
        // Remove tab param for default tab to keep URL clean
        params.delete('tab')
      } else {
        params.set('tab', tab)
      }

      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.replace(newUrl, { scroll: false })
    },
    [searchParams, router, pathname],
  )

  // Fix hydration issues and handle URL params
  useEffect(() => {
    setMounted(true)
    const tab = searchParams.get('tab')
    if (tab && ['parlays', 'chats', 'friends', 'history', 'achievements'].includes(tab)) {
      setActiveTabState(tab as ProfileTabType)
    }
  }, [searchParams])

  return {
    activeTab,
    setActiveTab,
    mounted,
    editingUsername,
    setEditingUsername,
  }
}
