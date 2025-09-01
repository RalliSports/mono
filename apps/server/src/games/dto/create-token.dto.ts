import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { GameAccessStatus } from '../enum/game';
import { ApiProperty } from '@nestjs/swagger';

export class Token {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ticker: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cluster: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mint: string;
}

export class CreateTokenDto extends Token {}
