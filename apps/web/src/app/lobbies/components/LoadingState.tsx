import LottieLoading from '@/components/ui/lottie-loading'

interface LoadingStateProps {}

export default function LoadingState({}: LoadingStateProps) {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <LottieLoading size="lg" message="Loading lobbies..." subMessage="Please wait while we fetch the latest games" />
    </div>
  )
}
