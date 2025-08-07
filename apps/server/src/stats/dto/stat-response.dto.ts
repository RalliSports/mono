import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class StatResponseDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  customId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;
}
