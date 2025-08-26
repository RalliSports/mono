import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStatDto {
  @ApiProperty()
  @IsNumber()
  customId: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  displayName: string;

  @ApiProperty()
  @IsString()
  shortDisplayName: string;

  @ApiProperty()
  @IsString()
  abbreviation: string;

  @ApiProperty()
  @IsString()
  statOddsName: string;
}
