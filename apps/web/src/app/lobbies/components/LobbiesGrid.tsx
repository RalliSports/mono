import LobbyCard from '@/components/main-feed/lobby-card'
import type { LobbiesGridProps } from './types'

export default function LobbiesGrid({ lobbies }: LobbiesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {lobbies.map((lobby) => (
        <LobbyCard
          key={lobby.id}
          id={lobby.id}
          title={lobby.title}
          participants={lobby.participants}
          maxParticipants={lobby.maxParticipants}
          buyIn={lobby.buyIn}
          prizePool={lobby.prizePool}
          imageUrl={lobby.imageUrl}
          legs={lobby.legs}
          timeLeft={lobby.timeLeft}
          host={lobby.host}
          isUrgent={lobby.isUrgent}
        />
      ))}
    </div>
  )
}
