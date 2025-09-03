import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  // IsOptional,
  IsString,
  IsUUID,
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
  @IsNumber()
  maxParticipants: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  numBets: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  matchupGroup: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tokenId: string;

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
  @IsNotEmpty()
  @IsUUID()
  gameModeId?: string;
}
