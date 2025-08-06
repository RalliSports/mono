import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateAthleteDto {
  @ApiProperty({ description: 'Athlete name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Team name' })
  @IsString()
  team: string;

  @ApiProperty({ description: 'Player position' })
  @IsString()
  position: string;

  @ApiProperty({
    description: 'Jersey number',
    minimum: 0,
    maximum: 100,
    example: 0,
  })
  @IsNumber()
  @Min(0)
  @Max(99)
  jerseyNumber: number;

  @ApiProperty({
    description: 'Player age',
    minimum: 16,
    maximum: 50,
    example: 0,
  })
  @IsNumber()
  @Min(16)
  @Max(50)
  age: number;

  @ApiProperty({ description: 'Player picture URL', required: false })
  @IsOptional()
  @IsString()
  picture?: string;
}
