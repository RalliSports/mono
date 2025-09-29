import { cn } from '@/lib/utils'
import { HTMLInputTypeAttribute } from 'react'

export const SearchBar = ({
  searchTerm,
  setSearchTerm,
  type = 'text',
  placeholder = 'Search options...',
  extraClass = '',
  extraContainerClass = '',
}: {
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
  type?: HTMLInputTypeAttribute
  placeholder?: string
  extraClass?: string
  extraContainerClass?: string
}) => {
  return (
    <div className={cn('p-3 border-b border-slate-700/50', extraContainerClass)}>
      <input
        type={type}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all',
          extraClass,
        )}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
