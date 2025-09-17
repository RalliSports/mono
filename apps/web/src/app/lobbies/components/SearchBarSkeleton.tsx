import { Skeleton } from '@/components/ui/skeleton'

export default function SearchBarSkeleton() {
  return (
    <div className="sticky top-[116px] z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/30 px-4 py-3">
      <div className="flex items-center space-x-3">
        <div className="relative flex-1">
          <Skeleton className="w-full h-10 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
