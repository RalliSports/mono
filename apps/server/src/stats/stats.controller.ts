import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiSecurity, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { StatResponseDto } from './dto/stat-response.dto';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get all stats' })
  @ApiResponse({
    status: 200,
    description: 'List of all stats',
    type: [StatResponseDto],
  })
  @Get()
  async getAllStats() {
    return this.statsService.getAllStats();
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get a stat by id' })
  @ApiResponse({
    status: 200,
    description: 'Stat fetch successfully',
    type: StatResponseDto,
  })
  @Get(':id')
  async getStatById(@Param('id') id: number) {
    return this.statsService.getStatById(id);
  }
}
