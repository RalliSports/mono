import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { AthleteResponseDto } from 'src/athletes/dto/athlete-response.dto';

export class TeamResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  foundedYear?: number;

  @ApiProperty()
  coachName?: string;

  @ApiProperty()
  avatar?: string;

  @ApiProperty()
  @IsArray()
  @Type(() => AthleteResponseDto)
  atheletes?: AthleteResponseDto[];

  @ApiProperty()
  createdAt: Date;
}
