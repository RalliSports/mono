import { PartialType } from '@nestjs/swagger';
import { CreateLineDto } from './create-line.dto';
import { IsDecimal, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResolveLineDto extends PartialType(CreateLineDto) {
  @ApiProperty()
  @IsDecimal()
  actualValue?: number | null;

  @ApiProperty()
  @IsBoolean()
  isHigher?: boolean | null;
}
