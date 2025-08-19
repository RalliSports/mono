import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMatchupDto } from './create-matchup.dto';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { MatchupStatus } from '../enum/matchups';

export class UpdateMatchupDto extends PartialType(CreateMatchupDto) {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  scoreHome: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  scoreAway: number;

  @ApiProperty({ enum: MatchupStatus })
  @IsEnum(MatchupStatus)
  @IsOptional()
  status: MatchupStatus;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  startsAtTimestamp: number;
}
