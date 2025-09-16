import axios from 'axios';

// Fetch live ESPN status of a matchup by espnEventId, returns parsed JSON or null
export async function fetchEspnMatchupStatus(espnEventId: string) {
  const url = `http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${espnEventId}/competitions/${espnEventId}/status?lang=en&region=us`;

  console.log(url);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    this.logger.error(
      `Error fetching ESPN status for event ${espnEventId}:`,
      error,
    );
    return null;
  }
}
