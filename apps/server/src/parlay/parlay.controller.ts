import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { CreatePoolDto } from './dto/create-parlay.dto';
import { ParlayService } from './parlay.service';

@ApiTags('parlay')
@Controller('')
export class ParlayController {
  constructor(private readonly parlayService: ParlayService) {}

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiCreatedResponse({ type: CreatePoolDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('create-parlay')
  async create(@Body() body: CreatePoolDto) {
    return this.parlayService.create(body);
  }

  @Get('getAllParlays')
  @ApiCreatedResponse()
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return this.parlayService.getAllPools();
  }
  
}
