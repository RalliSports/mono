import { Injectable } from '@nestjs/common';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';

@Injectable()
export class LinesService {
  create(createLineDto: CreateLineDto) {
    return 'This action adds a new line';
  }

  findAll() {
    return `This action returns all lines`;
  }

  findOne(id: number) {
    return `This action returns a #${id} line`;
  }

  update(id: number, updateLineDto: UpdateLineDto) {
    return `This action updates a #${id} line`;
  }

  remove(id: number) {
    return `This action removes a #${id} line`;
  }
}
