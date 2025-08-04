import { ApiProperty } from '@nestjs/swagger';

export class AthleteResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  team: string;

  @ApiProperty()
  position: string;

  @ApiProperty()
  jerseyNumber: number;

  @ApiProperty()
  age: number;

  @ApiProperty()
  picture: string;

  @ApiProperty()
  createdAt: Date;
}
