import LottieLoading from '@/components/ui/lottie-loading'

export default function LoadingSpinner() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center justify-center">
      <LottieLoading size="lg" message="Loading game..." subMessage="Please wait while we prepare your game" />
    </div>
  )
}
