import { Skeleton } from '@/components/ui/skeleton'

export default function PageHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Skeleton className="w-10 h-10 rounded-full mr-4" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div>
        <Skeleton className="h-9 w-20 rounded-xl" />
      </div>
    </div>
  )
}
