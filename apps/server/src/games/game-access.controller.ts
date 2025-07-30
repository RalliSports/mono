import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateGameAccessDto } from './dto/create-game-access.dto';
import { GameAccessService } from './game-access.service';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { UpdateGameAccessDto } from './dto/update-game-access.dto';

@Controller('')
export class GameAccessController {
  constructor(private readonly service: GameAccessService) {}

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Grant or update access for a user' })
  @ApiResponse({
    status: 201,
  })
  @Post('/game-access')
  create(@Body() dto: CreateGameAccessDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'View access list for a specific game' })
  @Get('/view-game-access-list')
  viewGameAccessList(@Param('gameId') gameId: string) {
    return this.service.ViewGameAccessList(gameId);
  }

  @ApiOperation({ summary: 'Check access status of a specific user' })
  @Get('/check-access/:userId')
  checkAccess(
    @Param('gameId') gameId: string,
    @Param('userId') userId: string,
  ) {
    return this.service.checkAccess(gameId, userId);
  }

  // Todo: Admin update access
  @Patch('/update/game-access/:id')
  update(@Param('id') id: string, @Body() dto: UpdateGameAccessDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: "Remove a user's access to the game" })
  @Delete('/revoke-access/:userId')
  remove(@Param('gameId') gameId: string, @Param('userId') userId: string) {
    return this.service.remove(gameId, userId);
  }
}
