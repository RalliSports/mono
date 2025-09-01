import { GamesFindOne } from '@repo/server'
import ParticipantCard from './ParticipantCard'

interface ParticipantsListProps {
  lobby: GamesFindOne
  expandedParticipants: string[]
  toggleParticipant: (participantId: string) => void
}

export default function ParticipantsList({ lobby, expandedParticipants, toggleParticipant }: ParticipantsListProps) {
  const isParticipantExpanded = (participantId: string) => expandedParticipants.includes(participantId)

  return (
    <div className="mb-6">
      <div className="mb-4">
        <h3 className="text-white font-bold text-lg mb-2">Current Players ({lobby.participants.length})</h3>
        <p className="text-slate-400 text-sm">See what picks other players have locked in</p>
      </div>

      <div className="space-y-4">
        {lobby.participants.map((participant) => (
          <ParticipantCard
            key={participant.id}
            participant={participant}
            lobby={lobby}
            isExpanded={isParticipantExpanded(participant.id)}
            onToggle={() => toggleParticipant(participant.id)}
          />
        ))}
      </div>
    </div>
  )
}
