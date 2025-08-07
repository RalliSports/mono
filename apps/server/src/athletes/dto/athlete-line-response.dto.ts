import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { AthleteResponseDto } from 'src/athletes/dto/athlete-response.dto';
import { LineResponseDto } from 'src/lines/dto/line-response.dto';

export class AthleteLineResponseDto extends AthleteResponseDto {


  @ApiProperty()
  lines: LineResponseDto[];
}
