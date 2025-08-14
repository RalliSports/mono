import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateTeamDto {
  @ApiProperty()
  @IsString()
  espnTeamId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  foundedYear?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  coachName?: string;

  @ApiProperty({
    description: 'Team avatar URL',
    example: 'https://example.com/avatar.png',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar?: string;
}
