import { Skeleton } from '@/components/ui/skeleton'

export default function FilterTabsSkeleton() {
  return (
    <div className="sticky top-[60px] z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/30 px-4 py-3">
      <div className="flex space-x-2 overflow-x-auto">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50"
          >
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-6 h-4 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
