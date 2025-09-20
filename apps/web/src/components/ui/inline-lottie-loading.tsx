'use client'

import { memo } from 'react'
import Lottie from 'lottie-react'
import loadingAnimation from '../../../public/loading.json'

interface InlineLottieLoadingProps {
  className?: string
  size?: number
}

const InlineLottieLoading = memo(
  ({
    className = '',
    size = 40, // doubled from 20 to 40
  }: InlineLottieLoadingProps) => {
    return (
      <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    )
  },
)

InlineLottieLoading.displayName = 'InlineLottieLoading'

export default InlineLottieLoading
