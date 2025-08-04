import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/dto/user-response.dto';

export class GameMode {
  @ApiProperty()
  id: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: string;
}

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
  userControlType: 'whitelist' | 'blacklist' | 'none';

  @ApiProperty()
  gameModeId: string;

  @ApiProperty()
  gameMode: GameMode;

  @ApiProperty()
  creator: User;
}
