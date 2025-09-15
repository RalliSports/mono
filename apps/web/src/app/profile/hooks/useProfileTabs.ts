import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function useProfileTabs() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('chats')
  const [mounted, setMounted] = useState(false)
  const [editingUsername, setEditingUsername] = useState(false)

  // Fix hydration issues and handle URL params
  useEffect(() => {
    setMounted(true)
    const tab = searchParams.get('tab')
    if (tab && ['parlays', 'chats', 'friends'].includes(tab)) {
      setActiveTab(tab)
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
