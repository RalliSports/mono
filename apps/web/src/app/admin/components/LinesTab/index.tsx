import CreateLineForm from './CreateLineForm'
import { Player, MatchUp } from '../types'
import { StatsFindById } from '@repo/server'

interface LinesTabProps {
  newLine: {
    playerId: string
    statTypeId: string
    value: number
    id: string
    gameDate: string
  }
  setNewLine: (line: any) => void
  handleCreateLine: () => void
  players: Player[]
  stats: StatsFindById[]
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
