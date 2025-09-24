import { useMediaQuery } from '@mui/material'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export function useScreenSize() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
  const isDesktop = useMediaQuery('(min-width: 1025px)')

  // Determine device type
  let deviceType: DeviceType = 'desktop'
  if (isMobile) deviceType = 'mobile'
  else if (isTablet) deviceType = 'tablet'

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType,
    // Convenience methods
    isMobileOrTablet: isMobile || isTablet,
    isTabletOrDesktop: isTablet || isDesktop,
  }
}
