// dto/leg.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsEnum, IsNumber } from 'class-validator';

export enum BetType {
  OVER = 'over',
  UNDER = 'under',
}

export class LegDto {
  @ApiProperty()
 @IsString()
  playerId: string;

  @ApiProperty()
  @IsString()
  statType: string;

  @ApiProperty()
  @IsNumber()
  line: number;

  @ApiProperty()
  @IsEnum(BetType)
  betType: BetType;
}
