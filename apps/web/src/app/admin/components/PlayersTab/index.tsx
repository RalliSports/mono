import CreatePlayerForm from './CreatePlayerForm'
import PlayersList from './PlayersList'

export default function PlayersTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CreatePlayerForm />
      <PlayersList />
    </div>
  )
}
