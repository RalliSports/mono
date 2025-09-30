import MockGamePage from '../components/MockGamePage'
import mockLobbiesData from '../components/mockLobbiesData'

export default function Game2Page() {
  return <MockGamePage lobby={mockLobbiesData.lobbies[1]} />
}
