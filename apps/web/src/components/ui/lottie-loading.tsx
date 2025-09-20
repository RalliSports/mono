'use client'

import { memo } from 'react'
import Lottie from 'lottie-react'
import loadingAnimation from '../../../public/loading.json'

interface LottieLoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  message?: string
  subMessage?: string
  loop?: boolean
}

const sizeClasses = {
  sm: 'w-24 h-24', // doubled from w-12 h-12
  md: 'w-40 h-40', // doubled from w-20 h-20
  lg: 'w-56 h-56', // doubled from w-28 h-28
  xl: 'w-80 h-80', // doubled from w-40 h-40
}

const LottieLoading = memo(({ size = 'md', className = '', message, subMessage, loop = true }: LottieLoadingProps) => {
  const sizeClass = sizeClasses[size]

  if (message || subMessage) {
    return (
      <div className="text-center">
        <div className={`${sizeClass} mx-auto mb-4 ${className}`}>
          <Lottie
            animationData={loadingAnimation}
            loop={loop}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        {message && <h2 className="text-xl font-semibold text-white mb-2">{message}</h2>}
        {subMessage && <p className="text-slate-400">{subMessage}</p>}
      </div>
    )
  }

  return (
    <div className={`${sizeClass} ${className}`}>
      <Lottie animationData={loadingAnimation} loop={loop} autoplay={true} style={{ width: '100%', height: '100%' }} />
    </div>
  )
})

LottieLoading.displayName = 'LottieLoading'

export default LottieLoading
