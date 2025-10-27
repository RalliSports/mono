import MainPageSkeleton from './MainPageSkeleton'

interface LoadingScreenProps {
  message?: string
  subMessage?: string
}

export default function LoadingScreen({}: LoadingScreenProps) {
  return <MainPageSkeleton />
}
