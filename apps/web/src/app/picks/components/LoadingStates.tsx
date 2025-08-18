interface LoadingStatesProps {
  isLoading?: boolean
  athletesCount: number
}

export default function LoadingStates({ isLoading = false, athletesCount }: LoadingStatesProps) {
  if (athletesCount === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00CED1] mx-auto mb-4"></div>
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
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-700 rounded"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
