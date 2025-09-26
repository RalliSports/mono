import InputSelector from './InputSelector'

interface BetsSelectorProps {
  numBets: number
  onChange: (bets: number) => void
}

export default function BetsSelector({ numBets, onChange }: BetsSelectorProps) {
  return (
    <InputSelector
      value={numBets}
      onChange={onChange}
      min={2}
      max={6}
      step={1}
      label="Number of Bets"
      description="Maximum bets allowed per participant"
      placeholder="Bets (2-6)"
      icon="🎲"
      colorScheme="teal"
    />
  )
}
