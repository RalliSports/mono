import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { AthleteResponseDto } from 'src/athletes/dto/athlete-response.dto';
import { MatchupResponseDto } from 'src/matchups/dto/matchup-response.dto';
import { StatResponseDto } from 'src/stats/dto/stat-response.dto';

export class LineResponseDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  @IsUUID()
  athleteId: string;

  @ApiProperty()
  @IsUUID()
  statId: string;

  @ApiProperty()
  @IsUUID()
  matchupId: string;

  @ApiProperty()
  predictedValue: string;

  @ApiProperty()
  actualValue: string;

  @ApiProperty()
  isHigher: boolean;

  @ApiProperty()
  stat: StatResponseDto;

  @ApiProperty()
  matchup: MatchupResponseDto;

  @ApiProperty()
  athlete: AthleteResponseDto;
}
