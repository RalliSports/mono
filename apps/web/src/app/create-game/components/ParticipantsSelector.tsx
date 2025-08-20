import InputSelector from './InputSelector'

interface ParticipantsSelectorProps {
  maxParticipants: number
  onChange: (participants: number) => void
}

export default function ParticipantsSelector({ maxParticipants, onChange }: ParticipantsSelectorProps) {
  return (
    <InputSelector
      value={maxParticipants}
      onChange={onChange}
      min={2}
      max={20}
      step={1}
      label="Max Participants"
      description="Maximum participants"
      placeholder="Players (2-20)"
      icon="👥"
      colorScheme="orange"
    />
  )
}
