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
  UseGuards,
} from '@nestjs/common';
import { LinesService } from './lines.service';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { ResolveLineDto } from './dto/resolve-line.dto';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { LineResponseDto } from './dto/line-response.dto';
import { UserPayload } from 'src/auth/auth.user.decorator';
import { User } from 'src/user/dto/user-response.dto';

@Controller('')
export class LinesController {
  constructor(private readonly linesService: LinesService) {}

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Create a new line' })
  @ApiResponse({
    status: 201,
    description: 'Line created successfully',
    type: LineResponseDto,
  })
  @Post('/create-line')
  async createLine(@Body() dto: CreateLineDto, @UserPayload() user: User) {
    return this.linesService.createLine(dto, user);
  }

  @ApiOperation({ summary: 'Get all lines' })
  @ApiResponse({
    status: 200,
    description: 'List of all lines',
    type: [LineResponseDto],
  })
  @Get('/lines')
  async getAllLines() {
    return this.linesService.getAllLines();
  }

  @ApiOperation({ summary: 'Get a line by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Line fetch successfully',
    type: LineResponseDto,
  })
  @Get('/line/:id')
  async getLine(@Param('id', ParseUUIDPipe) id: string) {
    const line = await this.linesService.getLineById(id);
    if (!line) throw new NotFoundException(`Line ${id} not found`);
    return line;
  }

  @ApiOperation({ summary: 'Update a line' })
  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Line updated successfully',
    type: LineResponseDto,
  })
  @Patch('/line/update/:id')
  async updateLine(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLineDto,
  ) {
    return this.linesService.updateLine(id, dto);
  }

  @ApiOperation({ summary: 'Delete a line' })
  @ApiResponse({
    status: 200,
    description: 'Line deleted successfully',
  })
  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @Delete('/line/delete/:id')
  async deleteLine(@Param('id', ParseUUIDPipe) id: string) {
    return this.linesService.deleteLine(id);
  }

  @ApiOperation({ summary: 'Resolve a line' })
  @ApiResponse({
    status: 200,
    description: 'Line resolved successfully',
    type: LineResponseDto,
  })
  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @Patch('/line/resolve/:id')
  async resolveLine(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ResolveLineDto,
    @UserPayload() user: User,
  ) {
    return this.linesService.resolveLine(id, dto, user);
  }
}
