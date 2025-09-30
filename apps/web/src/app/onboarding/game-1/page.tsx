import MockGamePage from '../components/MockGamePage'
import mockLobbiesData from '../components/mockLobbiesData'

export default function Game1Page() {
  return <MockGamePage lobby={mockLobbiesData.lobbies[0]} />
}
