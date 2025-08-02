import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LinesService } from './lines.service';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';

@Controller('lines')
export class LinesController {
  constructor(private readonly linesService: LinesService) {}

  // @Post()
  // create(@Body() createLineDto: CreateLineDto) {
  //   return this.linesService.create(createLineDto);
  // }

  // @Get()
  // findAll() {
  //   return this.linesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.linesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLineDto: UpdateLineDto) {
  //   return this.linesService.update(+id, updateLineDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.linesService.remove(+id);
  // }
}
