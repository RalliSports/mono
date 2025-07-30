import { PartialType } from '@nestjs/mapped-types';
import { CreateLineDto } from './create-line.dto';

export class UpdateLineDto extends PartialType(CreateLineDto) {}
