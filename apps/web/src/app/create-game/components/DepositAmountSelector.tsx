import InputSelector from './InputSelector'

interface DepositAmountSelectorProps {
  depositAmount: number
  onChange: (amount: number) => void
}

export default function DepositAmountSelector({ depositAmount, onChange }: DepositAmountSelectorProps) {
  return (
    <InputSelector
      value={depositAmount}
      onChange={onChange}
      min={5}
      max={500}
      step={5}
      label="Deposit Amount"
      description="Entry fee per player"
      placeholder="$ Amount (5-500)"
      icon="💰"
      colorScheme="cyan"
    />
  )
}
