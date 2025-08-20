import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLineDto } from './create-line.dto';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { LineStatus } from '../enum/lines';

export class UpdateLineDto extends PartialType(CreateLineDto) {
  @ApiProperty({ enum: LineStatus })
  @IsOptional()
  @IsEnum(LineStatus)
  status: LineStatus;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  predictedValue: number;
}
