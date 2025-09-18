import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
export type ProfileTabType = 'parlays' | 'chats' | 'friends' | 'history' | 'achievements'

export function useProfileTabs() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<ProfileTabType>('parlays')
  const [mounted, setMounted] = useState(false)
  const [editingUsername, setEditingUsername] = useState(false)

  // Fix hydration issues and handle URL params
  useEffect(() => {
    setMounted(true)
    const tab = searchParams.get('tab')
    if (tab && ['parlays', 'chats', 'friends', 'history', 'achievements'].includes(tab)) {
      setActiveTab(tab as ProfileTabType)
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
