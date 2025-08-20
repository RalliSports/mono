import { ReactNode } from 'react'
import GameNavigation from './GameNavigation'

interface JoinGameLayoutProps {
  children: ReactNode
}

export default function JoinGameLayout({ children }: JoinGameLayoutProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <GameNavigation />

      {/* Main Content */}
      <div className="px-4 pb-20">{children}</div>
    </div>
  )
}
