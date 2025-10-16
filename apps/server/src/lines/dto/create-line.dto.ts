import { IsUUID, IsNumber, IsDefined } from 'class-validator';
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
  predictedValue: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  oddsOver: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  oddsUnder: number;
}
