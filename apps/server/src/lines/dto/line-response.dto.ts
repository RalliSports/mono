import { ApiProperty } from '@nestjs/swagger';

export class LineResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;
}
