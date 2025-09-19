import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
export type GameTabType = 'parlays' | 'chats'

export function useGameTabs() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<GameTabType>('chats')
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues and handle URL params
  useEffect(() => {
    setMounted(true)
    const tab = searchParams.get('tab')
    if (tab && ['players', 'chat'].includes(tab)) {
      setActiveTab(tab as GameTabType)
    }
  }, [searchParams])

  return {
    activeTab,
    setActiveTab,
    mounted,
  }
}
