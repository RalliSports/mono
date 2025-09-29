import LobbyCard from '@/components/main-feed/lobby-card'
import { GamesServiceFindAllInstance } from '@repo/server'
export interface LobbiesGridProps {
  lobbies: GamesServiceFindAllInstance[]
}
export default function LobbiesGrid({ lobbies }: LobbiesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {lobbies.map((lobby) => (
        <LobbyCard key={lobby.id} lobby={lobby} />
      ))}
    </div>
  )
}
