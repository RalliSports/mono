import { GameSettings, FormErrors } from '../components/types'

export const useGameValidation = () => {
  const isValidUUID = (uuid: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)

  const validateForm = (gameSettings: GameSettings): FormErrors => {
    const errors: FormErrors = {}

    if (!gameSettings.title.trim()) errors.title = 'Title is required.'
    if (!gameSettings.matchupGroup.trim()) errors.matchupGroup = 'Matchup Group is required.'
    if (gameSettings.depositAmount < 5 || gameSettings.depositAmount > 500)
      errors.depositAmount = 'Deposit must be between $5 and $500.'
    if (gameSettings.maxParticipants < 2 || gameSettings.maxParticipants > 20)
      errors.maxParticipants = 'Participants must be between 2 and 20.'
    if (gameSettings.numBets < 1 || gameSettings.numBets > 10)
      errors.numBets = 'Number of Bets must be between 2 and 10.'
    if (!['1v1', 'limited', 'unlimited'].includes(gameSettings.type)) errors.type = 'Invalid contest type.'
    if (!['none', 'whitelist', 'blacklist'].includes(gameSettings.userControlType))
      errors.userControlType = 'Invalid user control type.'
    if (!gameSettings.gameMode || !isValidUUID(gameSettings.gameMode))
      errors.gameMode = 'Game Mode ID must be a valid UUID.'

    return errors
  }

  return {
    validateForm,
    isValidUUID,
  }
}
