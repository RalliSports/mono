'use client'

import React, { useEffect, useState } from 'react'
import { Game } from '@repo/db/types'

export default function AllGames() {
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    (async () => {
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

  console.log(games, 'all games')

  return (
    <div>
      {games.map((game, i) => (
        <GameCard key={i} game={game} />
      ))}
    </div>
  )
}

const GameCard = ({ game }: { game: Game }) => {
  return (
    <div>
      <h5>{game.title}</h5>
    </div>
  )
}
