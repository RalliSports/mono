'use client'

import React, { useEffect, useState } from 'react'
// import { Game } from '@repo/db/types'
import { GamesFindAll, GamesFindAllInstance, LineFindAll, LineFindAllInstance } from '@repo/server'
import { useToast } from '@/components/ui/toast'

export default function AllGames() {
  const { addToast } = useToast()
  const [games, setGames] = useState<GamesFindAll>([])
  const [lines, setLines] = useState<LineFindAll>([])

  useEffect(() => {
    ;(async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/games`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      })

      if (res.ok) {
        const data = await res.json()
        setGames(data)
      } else {
        const errorData = await res.json()
        addToast(errorData.error || 'Failed to fetch games', 'error')
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lines`, {
        method: 'GET',
      })
      if (res.ok) {
        const data = await res.json()
        setLines(data)
      } else {
        const errorData = await res.json()
        addToast(errorData.error || 'Failed to fetch lines', 'error')
      }
    })()
  }, [])

  return (
    <div>
      {games.map((game, i) => (
        <GameCard key={i} game={game} />
      ))}
      {lines.map((line, i) => (
        <LineCard key={i} line={line} />
      ))}
    </div>
  )
}

const LineCard = ({ line }: { line: LineFindAllInstance }) => {
  return (
    <div>
      <h5>{line.athlete?.name}</h5>
    </div>
  )
}

const GameCard = ({ game }: { game: GamesFindAllInstance }) => {
  return (
    <div>
      <h5>{game.title}</h5>
      <h5>{game.creator?.username}</h5>
      <h5>{game.participants?.length}</h5>
    </div>
  )
}
