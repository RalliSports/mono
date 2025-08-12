import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchupDto {
  @ApiProperty()
  @IsString()
  homeTeamId: string;

  @ApiProperty()
  @IsString()
  awayTeamId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  startsAtTimestamp: number;
}
