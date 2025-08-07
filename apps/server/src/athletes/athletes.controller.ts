import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AthletesService } from './athletes.service';
import { ApiSecurity, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { AthleteResponseDto } from './dto/athlete-response.dto';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { AthleteResponseWithLinesDto } from './dto/athlete-response-with-lines.dto';

@Controller('')
export class AthletesController {
  constructor(private readonly athletesService: AthletesService) {}

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get all athletes' })
  @ApiResponse({
    status: 200,
    description: 'List of all athletes',
    type: [AthleteResponseDto],
  })
  @Get('/athletes')
  async getAllAthletes() {
    return this.athletesService.getAllAthletes();
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get active athletes with unresolved lines' })
  @ApiResponse({
    status: 200,
    description: 'List of active athletes with unresolved lines',
    type: [AthleteResponseWithLinesDto],
  })
  @Get('/athletes/active')
  async getActiveAthletesWithUnresolvedLines() {
    return this.athletesService.getActiveAthletesWithUnresolvedLines();
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Create a new athlete' })
  @ApiResponse({
    status: 201,
    description: 'Athlete created successfully',
    type: AthleteResponseDto,
  })
  @Post('/create-athlete')
  async createAthlete(@Body() dto: CreateAthleteDto) {
    return this.athletesService.createAthlete(dto);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get an athlete by id' })
  @ApiResponse({
    status: 200,
    description: 'Athlete fetch successfully',
    type: AthleteResponseDto,
  })
  @Get('/athletes/:id')
  async getAthlete(@Param('id', ParseUUIDPipe) id: string) {
    return this.athletesService.getAthlete(id);
  }
}
