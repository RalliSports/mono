import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { TeamResponseDto } from './dto/team-response.dto';

@Controller('')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'Team created successfully',
    type: TeamResponseDto,
  })
  @Post('/team/create')
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @ApiResponse({
    status: 200,
    type: TeamResponseDto,
  })
  @Get('/team/:teamId')
  findOne(@Param('teamId') teamId: string) {
    return this.teamService.findOne(teamId);
  }

  @ApiResponse({
    status: 200,
    type: TeamResponseDto,
  })
  @Get('/team/:teamId/athletes')
  getAthletes(@Param('teamId') teamId: string) {
    return this.teamService.getAthletesForTeam(teamId);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiResponse({
    status: 200,
    type: TeamResponseDto,
  })
  @Patch('/team/update/:teamId')
  update(
    @Param('teamId') teamId: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.update(teamId, updateTeamDto);
  }

  @ApiResponse({
    status: 200,
    type: TeamResponseDto,
  })
  @Get('/team/:teamId/open-matchups')
  getOpenMatchups(@Param('teamId') teamId: string) {
    return this.teamService.getOpenMatchupsForTeam(teamId);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @Delete('/team/delete/:teamId')
  remove(@Param('teamId') teamId: string) {
    return this.teamService.remove(teamId);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiResponse({
    status: 200,
    type: [TeamResponseDto],
  })
  @Get('/teams')
  getAllTeams() {
    return this.teamService.getAllTeams();
  }
}
