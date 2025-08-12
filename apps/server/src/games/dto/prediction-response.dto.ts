import { ApiProperty } from '@nestjs/swagger';
import { LineResponseDto } from 'src/lines/dto/line-response.dto';
import { User } from 'src/user/dto/user-response.dto';

export class PredictionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  participantId: string;

  @ApiProperty()
  lineId: string;

  @ApiProperty()
  gameId: string;

  @ApiProperty()
  predictedDirection: string;

  @ApiProperty()
  isCorrect: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  user: User;

  @ApiProperty()
  line: LineResponseDto;
}
