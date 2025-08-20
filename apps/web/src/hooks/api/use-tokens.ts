'use client'

import { useMutation } from '@tanstack/react-query'
import { useApiWithAuth } from './base'

export function useFaucetTokens() {
  const api = useApiWithAuth()

  return useMutation({
    mutationFn: () => api.post('/api/faucet-tokens'),
  })
}
