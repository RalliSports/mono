import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function useGameTabs() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('chats')
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues and handle URL params
  useEffect(() => {
    setMounted(true)
    const tab = searchParams.get('tab')
    if (tab && ['players', 'chat'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  return {
    activeTab,
    setActiveTab,
    mounted,
  }
}
