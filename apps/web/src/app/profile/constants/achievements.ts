import { Achievement } from '../components/types'

export const ACHIEVEMENTS: Achievement[] = [
  {
    name: 'First Win',
    desc: 'Win your first bet',
    unlocked: true,
    icon: '🎯',
  },
  {
    name: 'Hot Streak',
    desc: 'Win 5 bets in a row',
    unlocked: true,
    icon: '🔥',
  },
  {
    name: 'Big Winner',
    desc: 'Win over $500',
    unlocked: false,
    icon: '💰',
  },
  {
    name: 'Social Butterfly',
    desc: 'Join 10 lobbies',
    unlocked: true,
    icon: '🦋',
  },
]
