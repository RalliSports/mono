import CreateLineForm from './CreateLineForm'
import { Player, Stat, MatchUp } from '../types'

interface LinesTabProps {
  newLine: {
    playerId: string
    statTypeId: string
    value: number
    gameId: string
    gameDate: string
  }
  setNewLine: (line: any) => void
  handleCreateLine: () => void
  players: Player[]
  stats: Stat[]
  matchUps: MatchUp[]
}

export default function LinesTab({ newLine, setNewLine, handleCreateLine, players, stats, matchUps }: LinesTabProps) {
  return (
    <CreateLineForm
      newLine={newLine}
      setNewLine={setNewLine}
      handleCreateLine={handleCreateLine}
      players={players}
      stats={stats}
      matchUps={matchUps}
    />
  )
}
