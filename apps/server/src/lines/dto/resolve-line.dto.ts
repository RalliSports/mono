import { PartialType } from '@nestjs/swagger';
import { CreateLineDto } from './create-line.dto';

export class ResolveLineDto extends PartialType(CreateLineDto) {}
