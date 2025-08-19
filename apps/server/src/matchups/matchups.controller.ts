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
  @ApiOperation({ summary: 'Get all matchups' })
  @ApiResponse({
    status: 200,
    description: 'List of all matchups',
    type: [MatchupResponseDto],
  })
  @Get()
  async getAllMatchups() {
    return this.matchupsService.getAllMatchups();
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get matchups that should have started' })
  @ApiResponse({
    status: 200,
    description: 'List of matchups that should have started',
    type: [MatchupResponseDto],
  })
  @Get('/should-have-started')
  async getMatchupsThatShouldHaveStarted() {
    return this.matchupsService.getMatchupsThatShouldHaveStarted();
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get a matchup by id' })
  @ApiResponse({
    status: 200,
    description: 'Matchup fetch successfully',
    type: MatchupResponseDto,
  })
  @Get(':id')
  async getMatchupById(@Param('id') id: string) {
    return this.matchupsService.getMatchupById(id);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Create a new matchup' })
  @ApiResponse({
    status: 201,
    description: 'Matchup created successfully',
    type: MatchupResponseDto,
  })
  @Post('/create')
  async createMatchup(@Body() dto: CreateMatchupDto) {
    return this.matchupsService.createMatchup(dto);
  }
}
