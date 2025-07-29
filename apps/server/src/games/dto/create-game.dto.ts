import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGameDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  depositAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  maxParticipants: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  maxBets: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  matchupGroup: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  depositToken: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty()
  @IsEnum(['1v1', 'limited', 'unlimited'])
  type: '1v1' | 'limited' | 'unlimited';

  @ApiProperty()
  @IsEnum(['whitelist', 'blacklist', 'none'])
  userControlType: 'whitelist' | 'blacklist' | 'none';

  @ApiProperty()
  @IsOptional()
  @IsString()
  gameModeId?: string;
}
