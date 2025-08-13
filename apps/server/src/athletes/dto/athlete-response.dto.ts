import { ApiProperty } from '@nestjs/swagger';

export class AthleteResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  espnAthleteId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  teamId: string;

  @ApiProperty()
  position: string;

  @ApiProperty()
  jerseyNumber: number;

  @ApiProperty()
  age: number;

  @ApiProperty()
  picture: string;

  @ApiProperty()
  customId: number;

  @ApiProperty()
  createdAt: Date;
}
