import LottieLoading from '@/components/ui/lottie-loading'

interface LoadingStatesProps {
  isLoading?: boolean
  athletesCount: number
}

export default function LoadingStates({ isLoading = false, athletesCount }: LoadingStatesProps) {
  if (athletesCount === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <LottieLoading size="md" className="mx-auto mb-4" />
          <div className="text-slate-400 text-sm">Loading athletes...</div>
        </div>
      </div>
    )
  }

  return null
}

export function PageLoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-screen">
          <LottieLoading size="xl" message="Loading page..." subMessage="Please wait while we prepare your content" />
        </div>
      </div>
    </div>
  )
}
