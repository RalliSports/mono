import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MatchupsService } from './matchups.service';
import { ApiSecurity, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { MatchupResponseDto } from './dto/matchup-response.dto';
import { CreateMatchupDto } from './dto/create-matchup.dto';
import { UpdateMatchupDto } from './dto/update-matchup.dto';
import { User } from 'src/user/dto/user-response.dto';
import { UserPayload } from 'src/auth/auth.user.decorator';
import { CreateLinesDto } from './dto/create-lines.dto';
import { ResolveLinesDto } from 'src/lines/dto/resolve-lines.dto';
import { tracer } from 'dd-trace';

@Controller('matchups')
export class MatchupsController {
  constructor(private readonly matchupsService: MatchupsService) {}

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get matchups with open lines' })
  @ApiResponse({
    status: 200,
    description: 'Matchups with open lines fetched successfully',
    type: [MatchupResponseDto],
  })
  @Get('/read-matchups-with-open-lines')
  async getMatchupsWithOpenLines() {
    console.log('=== CONTROLLER METHOD CALLED ===');
    console.log(
      'Controller: getMatchupsWithOpenLines called at',
      new Date().toISOString(),
    );
    try {
      console.log('Controller: About to call service method...');
      const result = await this.matchupsService.getMatchupsWithOpenLines();
      console.log(
        'Controller: getMatchupsWithOpenLines success, returning',
        result.length,
        'matchups',
      );
      return result;
    } catch (error) {
      console.error('Controller: getMatchupsWithOpenLines error:', error);
      console.error('Controller: Error details:', error.message);
      throw error;
    }
  }

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
  @ApiOperation({ summary: 'Get all matchups' })
  @ApiResponse({
    status: 200,
    description: 'List of all matchups',
    type: [MatchupResponseDto],
  })
  @Get('/open')
  async getAllOpenMatchups() {
    console.log('=== CONTROLLER METHOD CALLED ===');
    console.log(
      'Controller: getAllOpenMatchups called at',
      new Date().toISOString(),
    );
    try {
      console.log('Controller: About to call service method...');
      const result = await this.matchupsService.getAllOpenMatchups();
      console.log(
        'Controller: getAllOpenMatchups success, returning',
        result.length,
        'matchups',
      );
      return result;
    } catch (error) {
      console.error('Controller: getAllOpenMatchups error:', error);
      console.error('Controller: Error details:', error.message);
      throw error;
    }
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Update a matchup' })
  @ApiResponse({
    status: 200,
    description: 'Matchup updated successfully',
    type: MatchupResponseDto,
  })
  @Post('/update/:id')
  async updateMatchup(@Param('id') id: string, @Body() dto: UpdateMatchupDto) {
    return this.matchupsService.updateMatchup(id, dto);
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

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Create lines for a matchup from Odds API data' })
  @ApiResponse({
    status: 201,
    description: 'Lines created successfully for matchup - ${matchupId}',
    type: MatchupResponseDto,
  })
  @Post('/create-lines')
  async createMatchupLines(
    @Body() dto: CreateLinesDto,
    @UserPayload() user: User,
  ) {
    return this.matchupsService.createLinesForMatchup(dto, user);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({
    summary: 'Resolve lines for matchups with ESPN final score data',
  })
  @ApiResponse({
    status: 200,
    description: 'Lines resolved successfully',
    type: MatchupResponseDto,
  })
  @Post('/resolve-lines')
  async resolveMatchupLines(
    @Body() dto: ResolveLinesDto,
    @UserPayload() user: User,
  ) {
    return this.matchupsService.resolveLinesForMatchup(dto, user);
  }
}
