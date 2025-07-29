import { ApiProperty } from '@nestjs/swagger';
import { GameAccessResponseDto } from './game-access-response.dto';

export class GameResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  creatorId: string;

  @ApiProperty()
  depositAmount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  maxParticipants: number;

  @ApiProperty()
  gameCode: string;

  @ApiProperty()
  matchupGroup: string;

  @ApiProperty()
  depositToken: string;

  @ApiProperty()
  isPrivate: boolean;

  @ApiProperty()
  type: 'parlay' | 'head_to_head' | 'pool';

  @ApiProperty()
  gameAccess: GameAccessResponseDto;

  @ApiProperty()
  userControlType: 'whitelist' | 'blacklist' | 'none';

  @ApiProperty()
  gameModeId: string;
}
