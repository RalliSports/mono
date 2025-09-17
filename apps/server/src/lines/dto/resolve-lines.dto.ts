import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResolveLinesDto {
  @ApiProperty()
  @IsUUID()
  matchupId: string;
}
