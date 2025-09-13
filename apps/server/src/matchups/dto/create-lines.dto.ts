import { IsUUID, IsNumber, IsDefined, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLinesDto {
  @ApiProperty()
  @IsUUID()
  matchupId: string;
}
