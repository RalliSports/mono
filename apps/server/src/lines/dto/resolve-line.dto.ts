import { IsNumber, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResolveLineDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  actualValue?: number;


  @ApiProperty()
  @IsUUID()
  lineId: string;
}
