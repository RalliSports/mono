import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LinesService } from './lines.service';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { ResolveLineDto } from './dto/resolve-line.dto';

@Controller('lines')
export class LinesController {
  constructor(private readonly linesService: LinesService) {}

  @Post()
  async createLine(@Body() dto: CreateLineDto) {
    return this.linesService.createLine(dto);
  }

  @Get()
  async getAllLines() {
    return this.linesService.getAllLines();
  }

  @Get(':id')
  async getLine(@Param('id', ParseUUIDPipe) id: string) {
    const line = await this.linesService.getLineById(id);
    if (!line) throw new NotFoundException(`Line ${id} not found`);
    return line;
  }

  @Patch(':id')
  async updateLine(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLineDto,
  ) {
    return this.linesService.updateLine(id, dto);
  }

  @Delete(':id')
  async deleteLine(@Param('id', ParseUUIDPipe) id: string) {
    return this.linesService.deleteLine(id);
  }

  // Resolve line (update predictedValue, actualValue, isHigher)
  @Patch(':id/resolve')
  async resolveLine(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ResolveLineDto,
  ) {
    return this.linesService.resolveLine(id, dto);
  }
}
