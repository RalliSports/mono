import { IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchupDto {
  @ApiProperty()
  @IsString()
  homeTeam: string;

  @ApiProperty()
  @IsString()
  awayTeam: string;

  @ApiProperty()
  @IsDate()
  gameDate: Date;
}
