import type { FilterTab } from '../components/types'

export const createFilterTabs = (lobbiesData: any[]): FilterTab[] => [
  {
    id: 'all',
    name: 'All',
    icon: '🏆',
    count: lobbiesData.length,
    color: 'from-[#00CED1] to-[#FFAB91]',
  },
  {
    id: 'waiting',
    name: 'Waiting',
    icon: '⏳',
    count: lobbiesData.filter((l) => l.status === 'waiting').length,
    color: 'from-blue-500 to-blue-400',
  },
  {
    id: 'active',
    name: 'Active',
    icon: '🔴',
    count: lobbiesData.filter((l) => l.status === 'active').length,
    color: 'from-green-500 to-green-400',
  },
  {
    id: 'complete',
    name: 'Complete',
    icon: '✅',
    count: lobbiesData.filter((l) => l.status === 'complete').length,
    color: 'from-emerald-500 to-emerald-400',
  },
  {
    id: 'pending',
    name: 'Pending',
    icon: '⏱️',
    count: lobbiesData.filter((l) => l.status === 'pending').length,
    color: 'from-yellow-500 to-yellow-400',
  },
]
