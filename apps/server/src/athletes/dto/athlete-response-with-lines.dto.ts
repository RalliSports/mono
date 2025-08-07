import { ApiProperty } from '@nestjs/swagger';

export class StatSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class LineSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  predictedValue: string;

  @ApiProperty({ type: StatSummaryDto })
  stat: StatSummaryDto;
}

export class AthleteResponseWithLinesDto {
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

  @ApiProperty({ type: [LineSummaryDto] })
  lines: LineSummaryDto[];
}
