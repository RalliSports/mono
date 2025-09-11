import CreatePlayerForm from './CreatePlayerForm'
import PlayersList from './PlayersList'
import { AthletesFindOne } from '@repo/server'

interface PlayersTabProps {
  players: AthletesFindOne[]
  newPlayer: {
    name: string
    team: string
    position: string
    jerseyNumber: number
    age: number
    picture: string
  }
  setNewPlayer: (player: any) => void
  handleCreatePlayer: () => void
}

export default function PlayersTab({ players, newPlayer, setNewPlayer, handleCreatePlayer }: PlayersTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CreatePlayerForm newPlayer={newPlayer} setNewPlayer={setNewPlayer} handleCreatePlayer={handleCreatePlayer} />
      <PlayersList players={players} />
    </div>
  )
}
