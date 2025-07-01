import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreatePoolDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'entryAmount must be greater than zero' })
  entryAmount: number;
}
