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
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#00CED1]/20 border-t-[#00CED1] rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">{message}</h2>
        <p className="text-slate-400">{subMessage}</p>
      </div>
    </div>
  )
}
