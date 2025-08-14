import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsEnum,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { PredictionDirection } from '../enum/game';

export class CreateBetDto {
  @ApiProperty()
  @IsUUID()
  lineId: string;

  @ApiProperty()
  @IsEnum(PredictionDirection)
  predictedDirection: PredictionDirection;
}

export class BulkCreateBetsDto {
  @ApiProperty({ type: CreateBetDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => CreateBetDto)
  @ArrayMinSize(1)
  bets: CreateBetDto[];

  @ApiProperty()
  @IsUUID()
  gameId: string;

  // @ApiProperty()
  // @IsOptional()
  // gameCode: string;
}
