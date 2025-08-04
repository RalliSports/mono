import { ApiProperty } from '@nestjs/swagger';

export class GameModeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;
}
