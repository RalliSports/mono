import { IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchupDto {
  @ApiProperty()
  @IsString()
  homeTeamId: string;

  @ApiProperty()
  @IsString()
  awayTeamId: string;

  @ApiProperty()
  @IsString()
  gameDate: string;
}
