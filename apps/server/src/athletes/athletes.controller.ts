import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AthletesService } from './athletes.service';
import { ApiSecurity, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { AthleteResponseDto } from './dto/athlete-response.dto';

@Controller('athletes')
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
  @Get()
  async getAllAthletes() {
    return this.athletesService.getAllAthletes();
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get an athlete by id' })
  @ApiResponse({
    status: 200,
    description: 'Athlete fetch successfully',
    type: AthleteResponseDto,
  })
  @Get(':id')
  async getAthlete(@Param('id', ParseUUIDPipe) id: string) {
    return this.athletesService.getAthlete(id);
  }
}
