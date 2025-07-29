import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { GameAccessStatus } from '../enum/game';

export class UpdateGameAccessDto {
  @ApiProperty()
  @IsEnum(GameAccessStatus)
  status: GameAccessStatus;
}
