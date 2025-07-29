import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGameModeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty()
  @IsString()
  description: string;
}
