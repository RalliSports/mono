import { Skeleton } from '@/components/ui/skeleton'

export default function GameStatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 shadow-2xl"
        >
          <Skeleton className="h-3 w-12 mb-2" />
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  )
}
