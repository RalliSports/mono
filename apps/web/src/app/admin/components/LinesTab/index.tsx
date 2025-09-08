import CreateLineForm from './CreateLineForm'
import { StatsFindById, AthletesFindOne, MatchupsFindById, LineCreate} from '@repo/server'

interface LinesTabProps {
  newLine: {
    playerId: string;
    statTypeId: string;
    value: number;
    id: string;
    gameDate: string;
  };
  setNewLine: (line: Partial<LineCreate> & { playerId: string; statTypeId: string; value: number; id: string }) => void;
  handleCreateLine: () => Promise<void>;
  players: AthletesFindOne[];
  stats: StatsFindById[];
  matchUps: MatchupsFindById[];
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
