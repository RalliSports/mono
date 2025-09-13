import CreateLineForm from './CreateLineForm'
import { MatchupsFindById, LineCreate } from '@repo/server'

interface LinesTabProps {
  newLine: {
    playerId: string
    statTypeId: string
    value: number
    id: string
    gameDate: string
  }
  setNewLine: (line: Partial<LineCreate> & { playerId: string; statTypeId: string; value: number; id: string }) => void
  handleCreateLine: () => Promise<void>
  matchUps: MatchupsFindById[]
}

export default function LinesTab({ newLine, setNewLine, handleCreateLine, matchUps }: LinesTabProps) {
  return (
    <CreateLineForm newLine={newLine} setNewLine={setNewLine} handleCreateLine={handleCreateLine} matchUps={matchUps} />
  )
}
