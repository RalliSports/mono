import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/dto/user-response.dto';
import { PredictionResponseDto } from './prediction-response.dto';

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

export class Participant {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user: User;

  @ApiProperty()
  isWinner: boolean;

  @ApiProperty()
  joinedAt: Date;
  
  @ApiProperty()
  predictions: PredictionResponseDto[];
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
  numBets: number;

  @ApiProperty()
  gameCode: string;

  @ApiProperty()
  matchupGroup: string;

  @ApiProperty()
  depositToken: string;

  @ApiProperty()
  createdTxnSignature: string;

  @ApiProperty()
  resolvedTxnSignature: string;

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

  @ApiProperty()
  participants: Participant[];
}
