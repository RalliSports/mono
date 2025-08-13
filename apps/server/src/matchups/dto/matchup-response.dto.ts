import { ApiProperty } from '@nestjs/swagger';

export class MatchupResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  espnEventId: string;

  @ApiProperty()
  homeTeam: string;

  @ApiProperty()
  awayTeam: string;

  @ApiProperty()
  gameDate: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  scoreHome: number;

  @ApiProperty()
  scoreAway: number;

  @ApiProperty()
  createdAt: Date;
}
