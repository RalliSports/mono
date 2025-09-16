import LottieLoading from '@/components/ui/lottie-loading'

interface LoadingScreenProps {
  message?: string
  subMessage?: string
}

export default function LoadingScreen({
  message = 'Connecting to wallet...',
  subMessage = 'Please wait while we establish your connection',
}: LoadingScreenProps) {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <LottieLoading size="lg" message={message} subMessage={subMessage} />
    </div>
  )
}
