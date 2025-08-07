import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsEnum, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { PredictionDirection } from '../enum/game';

export class CreatePredictionDto {

  @ApiProperty()
  @IsUUID()
  lineId: string;

  @ApiProperty()
  @IsEnum(PredictionDirection)
  predictedDirection: PredictionDirection;
}

export class BulkCreatePredictionsDto {
  @ApiProperty({ type: CreatePredictionDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => CreatePredictionDto)
  @ArrayMinSize(1)
  predictions: CreatePredictionDto[];

  @ApiProperty()
  @IsUUID()
  gameId: string;

  // @ApiProperty()
  // @IsOptional()
  // gameCode: string;
}
