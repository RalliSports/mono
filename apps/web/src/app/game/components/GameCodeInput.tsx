'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'

interface GameCodeInputProps {
  gameId: string
  expectedCode: string
}

export default function GameCodeInput({ gameId, expectedCode }: GameCodeInputProps) {
  const [code, setCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsValidating(true)

    if (!code.trim()) {
      addToast('Please enter a game code', 'error')
      setIsValidating(false)
      return
    }

    if (code.trim() !== expectedCode) {
      addToast('Invalid game code. Please try again.', 'error')
      setIsValidating(false)
      return
    }

    // Add the code to URL params and refresh
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('code', code.trim())
    router.push(`/game?id=${gameId}&${newSearchParams.toString()}`)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="gameCode" className="block text-sm font-medium text-white mb-2">
            Enter Game Code
          </label>
          <Input
            id="gameCode"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter the game code to join"
            className="w-full bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-[#00CED1] focus:ring-[#00CED1]/30"
            disabled={isValidating}
          />
        </div>

        <button
          type="submit"
          disabled={isValidating || !code.trim()}
          className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-slate-900 font-bold py-3 rounded-xl hover:shadow-xl hover:shadow-[#00CED1]/30 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isValidating ? 'Validating...' : 'Join Game'}
        </button>
      </form>
    </div>
  )
}
