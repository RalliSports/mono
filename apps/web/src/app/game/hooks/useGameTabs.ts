import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
export type GameTabType = 'parlays' | 'chats'

export function useGameTabs() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTabState] = useState<GameTabType>('parlays')
  const [mounted, setMounted] = useState(false)

  // Function to update both state and URL for better deep linking support
  const setActiveTab = useCallback(
    (tab: GameTabType) => {
      console.log('Setting game tab to:', tab)
      setActiveTabState(tab)

      // Update URL with new tab parameter while preserving other params
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
    const channel = searchParams.get('channel')

    // If there's a channel param, automatically switch to chats tab
    if (channel) {
      setActiveTabState('chats')
    } else if (tab && ['parlays', 'chats'].includes(tab)) {
      setActiveTabState(tab as GameTabType)
    }
  }, [searchParams])

  return {
    activeTab,
    setActiveTab,
    mounted,
  }
}
