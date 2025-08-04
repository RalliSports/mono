import {
  IsUUID,
  IsDecimal,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsDefined,
} from 'class-validator';

export class CreateLineDto {
  @IsUUID()
  athleteId: string;

  @IsNumber()
  statId: number;

  @IsUUID()
  matchupId: string;

  @IsDefined()
  @IsDecimal()
  predictedValue: number;

  @IsOptional()
  @IsDecimal()
  actualValue?: number | null;

  @IsOptional()
  @IsBoolean()
  isHigher?: boolean | null;
}
