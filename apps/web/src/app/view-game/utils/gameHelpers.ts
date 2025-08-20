export const getVisibilityIcon = (visibility: string) => {
  switch (visibility) {
    case 'public':
      return '🌍'
    case 'private':
      return '🔒'
    case 'friends':
      return '👥'
    default:
      return '🌍'
  }
}

export const getVisibilityColor = (visibility: string) => {
  switch (visibility) {
    case 'public':
      return 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30'
    case 'private':
      return 'text-red-400 bg-red-400/20 border-red-400/30'
    case 'friends':
      return 'text-blue-400 bg-blue-400/20 border-blue-400/30'
    default:
      return 'text-slate-400 bg-slate-400/20 border-slate-400/30'
  }
}
