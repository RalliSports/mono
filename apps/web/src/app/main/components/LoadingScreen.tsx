import MainPageSkeleton from './MainPageSkeleton'

interface LoadingScreenProps {
  message?: string
  subMessage?: string
}

export default function LoadingScreen({
  message = 'Connecting to wallet...',
  subMessage = 'Please wait while we establish your connection',
}: LoadingScreenProps) {
  return <MainPageSkeleton />
}
