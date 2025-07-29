import { ApiProperty } from '@nestjs/swagger';
import { GameAccessStatus } from '../enum/game';

export class GameAccessResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  gameId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  status: GameAccessStatus;

  @ApiProperty()
  createdAt: Date;
}
