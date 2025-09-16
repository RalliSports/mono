import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ellipsify(str = '', len = 4, delimiter = '..') {
  const strLen = str.length
  const limit = len * 2 + delimiter.length

  return strLen >= limit ? str.substring(0, len) + delimiter + str.substring(strLen - len, strLen) : str
}

export function formatBalance(amount: number | undefined | null) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0.00'
  }
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const getShortenedPosition = (position: string) => {
  if (position === 'Quarterback') return 'QB'
  if (position === 'Running Back') return 'RB'
  if (position === 'Wide Receiver') return 'WR'
  if (position === 'Tight End') return 'TE'
  if (position === 'Defensive End') return 'DE'
  if (position === 'Defensive Tackle') return 'DT'
  if (position === 'Linebacker') return 'LB'
  if (position === 'Cornerback') return 'CB'
  if (position === 'Safety') return 'S'
  if (position === 'Kicker') return 'K'
  if (position === 'Punter') return 'P'
  return position
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
