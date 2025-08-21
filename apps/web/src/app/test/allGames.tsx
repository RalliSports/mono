'use client'

import React, { useEffect, useState } from 'react'
// import { Game } from '@repo/db/types'
import { GamesFindAll, GamesFindAllInstance, LineFindAll, LineFindAllInstance } from '@repo/server'

export default function AllGames() {
  const [games, setGames] = useState<GamesFindAll>([])
  const [lines, setLines] = useState<LineFindAll>([])

  useEffect(() => {
    ;(async () => {
      const res = await fetch('http://localhost:4000/api/v1/games', {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      })

      const data = await res.json()
      console.log(data, 'data')
      setGames(data)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const res = await fetch('http://localhost:4000/api/v1/lines', {
        method: 'GET',
      })
      const data = await res.json()
      console.log(data, 'data')
      setLines(data)
    })()
  }, [])

  console.log(games, 'all games')

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
