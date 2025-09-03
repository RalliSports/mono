export interface GameSettings {
  title: string
  depositAmount: number
  maxParticipants: number
  matchupGroup: string
  isPrivate: boolean
  depositToken: string
  type: 'limited' | '1v1' | 'unlimited'
  userControlType: 'none' | 'whitelist' | 'blacklist'
  gameMode: string
  numBets: number
  tokenId: string
}

export interface FormErrors {
  [key: string]: string
}

export type CreatingGameState = 'idle' | 'loading' | 'success' | 'error'

export interface InputSelectorProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  label: string
  description: string
  placeholder: string
  icon: string
  colorScheme: 'cyan' | 'orange' | 'teal'
}
