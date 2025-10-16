import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLineDto } from './create-line.dto';
import { IsBoolean, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { LineStatus } from '../enum/lines';

export class UpdateLineDto extends PartialType(CreateLineDto) {
  @ApiProperty({ enum: LineStatus })
  @IsOptional()
  @IsEnum(LineStatus)
  status?: LineStatus;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  predictedValue?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  currentValue?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  lastUpdatedAt?: Date;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isLatestOne?: boolean;
}
