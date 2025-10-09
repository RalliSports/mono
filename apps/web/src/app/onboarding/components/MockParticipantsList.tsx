import ParticipantCard from '../../game/components/ParticipantCard'
import { useEffect, useState } from 'react'

interface MockParticipantsListProps {
  lobby: any
  expandedParticipants: string[]
  toggleParticipant: (participantId: string) => void
}

export default function MockParticipantsList({
  lobby,
  expandedParticipants,
  toggleParticipant,
}: MockParticipantsListProps) {
  const [userPicks, setUserPicks] = useState<any>(null)

  useEffect(() => {
    // Check if user has picks for this lobby
    const storedPicks = localStorage.getItem('onboardingUserPicks')
    if (storedPicks) {
      const picksData = JSON.parse(storedPicks)
      if (picksData.lobbyId === lobby.id) {
        setUserPicks(picksData)
      }
    }
  }, [lobby.id])

  // Always use a safe array for participants
  let participants: any[] = []
  if (lobby && Array.isArray(lobby.participants)) {
    participants = lobby.participants
  } else if (lobby && typeof lobby.participants === 'object' && lobby.participants !== null) {
    participants = Object.values(lobby.participants)
  }

  // Add current user as participant if they have picks
  if (userPicks) {
    const currentUser = {
      id: 'current-user',
      userId: 'current-user',
      user: {
        id: 'current-user',
        username: 'You',
        avatar: '/images/pfp-2.svg',
      },
      joinedAt: userPicks.joinedAt,
      bets: userPicks.selectedPicks.map((pick: any, index: number) => ({
        id: `user-bet-${index}`,
        predictedDirection: pick.predictedDirection,
        isCorrect: true, // Show as green since these are the user's picks
        line: {
          status: 'locked', // Changed from 'active' to 'locked' so it shows properly
          predictedValue: pick.athlete.lines[pick.statIndex].predictedValue,
          currentValue: null,
          actualValue: null,
          athleteId: pick.athleteId,
          athlete: pick.athlete,
          matchup: pick.athlete.lines[pick.statIndex].matchup,
          stat: pick.athlete.lines[pick.statIndex].stat,
        },
      })),
    }
    participants = [currentUser, ...participants]
  }

  const isParticipantExpanded = (participantId: string) => expandedParticipants.includes(participantId)

  return (
    <div className="mb-6">
      <div className="mb-4">
        <h3 className="text-white font-bold text-lg mb-2">Current Players ({participants.length})</h3>
        <p className="text-slate-400 text-sm">See what picks other players have locked in</p>
      </div>
      <div className="space-y-4">
        {participants.length === 0 ? (
          <div className="text-slate-400 text-sm">No participants yet.</div>
        ) : (
          participants.map((participant: any) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              lobby={lobby}
              isExpanded={isParticipantExpanded(participant.id)}
              onToggle={() => toggleParticipant(participant.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
