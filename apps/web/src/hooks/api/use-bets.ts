'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiWithAuth } from './base'
import { CreateBetDtoType } from '@repo/server'

export function useCreateBet() {
  const queryClient = useQueryClient()
  const api = useApiWithAuth()

  return useMutation({
    mutationFn: (data: CreateBetDtoType) => api.post('/api/create-bet', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      queryClient.invalidateQueries({ queryKey: ['my-open-games'] })
    },
  })
}
