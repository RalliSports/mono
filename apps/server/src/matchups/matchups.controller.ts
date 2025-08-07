import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MatchupsService } from './matchups.service';
import { ApiSecurity, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { MatchupResponseDto } from './dto/matchup-response.dto';
import { CreateMatchupDto } from './dto/create-matchup.dto';

@Controller('matchups')
export class MatchupsController {
  constructor(private readonly matchupsService: MatchupsService) {}

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get all stats' })
  @ApiResponse({
    status: 200,
    description: 'List of all stats',
    type: [MatchupResponseDto],
  })
  @Get()
  async getAllStats() {
    return this.matchupsService.getAllMatchups();
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get a stat by id' })
  @ApiResponse({
    status: 200,
    description: 'Stat fetch successfully',
    type: MatchupResponseDto,
  })
  @Get(':id')
  async getMatchupById(@Param('id') id: string) {
    return this.matchupsService.getMatchupById(id);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Create a new line' })
  @ApiResponse({
    status: 201,
    description: 'Line created successfully',
    type: MatchupResponseDto,
  })
  @Post('/create')
  async createMatchup(@Body() dto: CreateMatchupDto) {
    return this.matchupsService.createMatchup(dto);
  }
}
