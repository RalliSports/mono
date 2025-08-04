import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { GameAccessStatus } from '../enum/game';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGameAccessDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(GameAccessStatus)
  status: GameAccessStatus;
}
