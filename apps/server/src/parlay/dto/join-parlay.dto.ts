// dto/join-pool.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LegDto } from './leg.dto';

export class JoinPoolDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  poolId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  legs: LegDto[];
}
