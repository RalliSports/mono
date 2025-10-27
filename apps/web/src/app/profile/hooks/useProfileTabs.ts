"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

export type ProfileTabType = "parlays" | "chats" | "friends" | "history" | "achievements"

export function useProfileTabs() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTabState] = useState<ProfileTabType>("parlays")
  const [mounted, setMounted] = useState(false)
  const [editingUsername, setEditingUsername] = useState(false)

  const setActiveTab = useCallback(
    (tab: ProfileTabType) => {
      setActiveTabState(tab)

      // Only modify URL after mount to avoid hydration reloads
      if (!mounted) return

      const params = new URLSearchParams(searchParams.toString())
      if (tab === "parlays") {
        params.delete("tab")
      } else {
        params.set("tab", tab)
      }

      // Use window.history API instead of router.replace to avoid re-render or reload
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
      window.history.replaceState(null, "", newUrl)
    },
    [mounted, searchParams, pathname]
  )

  useEffect(() => {
    setMounted(true)
    const tab = searchParams.get("tab")
    if (tab && ["parlays", "chats", "friends", "history", "achievements"].includes(tab)) {
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
