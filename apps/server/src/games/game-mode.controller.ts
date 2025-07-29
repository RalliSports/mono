import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GameModeService } from './game-mode.service';
import { CreateGameModeDto } from './dto/create-game-mode.dto';
import { UpdateGameModeDto } from './dto/update-game-mode.dto';

@Controller('')
export class GameModeController {
  constructor(private readonly service: GameModeService) {}

  @Post('/create-game-mode')
  create(@Body() dto: CreateGameModeDto) {
    return this.service.create(dto);
  }

  @Get('/get-game-modes')
  findAll() {
    return this.service.findAll();
  }

  @Get('/get-game-mode/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('/update-game-mode:id')
  update(@Param('id') id: string, @Body() dto: UpdateGameModeDto) {
    return this.service.update(id, dto);
  }

  @Delete('/delete/game-mode/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
