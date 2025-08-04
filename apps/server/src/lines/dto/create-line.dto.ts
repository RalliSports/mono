import {
  IsUUID,
  IsDecimal,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsDefined,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLineDto {
  @ApiProperty()
  @IsUUID()
  athleteId: string;

  @ApiProperty()
  @IsNumber()
  statId: number;

  @ApiProperty()
  @IsUUID()
  matchupId: string;

  @ApiProperty()
  @IsDefined()
  @IsDecimal()
  predictedValue: number;

  @ApiProperty()
  @IsOptional()
  @IsDecimal()
  actualValue?: number | null;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isHigher?: boolean | null;
}
