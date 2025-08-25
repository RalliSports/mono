'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import { GamesSubmitBets} from '@repo/server'

export function useCreateBet() {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  return useMutation({
    mutationFn: (data: GamesSubmitBets) => api.post('/api/create-bet', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['my-open-games'] })
    },
  })
}
