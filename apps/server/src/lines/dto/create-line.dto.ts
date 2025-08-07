import { IsUUID, IsNumber, IsDefined, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLineDto {
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
  @IsDefined()
  @IsNumber()
  @Min(0)
  predictedValue: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  startsAtTimestamp: number;
}
