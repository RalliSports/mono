import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GamesService } from './games.service';
import { GameResponseDto } from './dto/game-response.dto';
import { BulkCreateBetsDto } from './dto/bet.dto';
import { UserPayload } from 'src/auth/auth.user.decorator';
import { User } from 'src/user/dto/user-response.dto';

@Controller('')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({
    status: 201,
    description: 'Game created successfully',
    type: GameResponseDto,
  })
  @Post('/create-game')
  create(@Body() createGameDto: CreateGameDto, @UserPayload() user: User) {
    return this.gamesService.create(createGameDto, user);
  }

  @ApiOperation({ summary: 'Get all games' })
  @ApiResponse({
    status: 200,
    description: 'List of all games',
    type: [GameResponseDto],
  })
  @Get('/games')
  findAll() {
    return this.gamesService.findAll();
  }

  @ApiOperation({ summary: 'Get all games' })
  @UseGuards(SessionAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'List of all games',
    type: [GameResponseDto],
  })
  @Get('/games/my-open-games')
  findMyOpenGames(@UserPayload() user: User) {
    return this.gamesService.getMyOpenGames(user);
  }

  @ApiOperation({ summary: 'Get all games' })
  @UseGuards(SessionAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'List of all games',
    type: [GameResponseDto],
  })
  @Get('/games/my-completed-games')
  findMyCompletedGames(@UserPayload() user: User) {
    return this.gamesService.getMyCompletedGames(user);
  }

  @ApiOperation({ summary: 'Get all games' })
  @ApiResponse({
    status: 200,
    description: 'List of all games',
    type: [GameResponseDto],
  })
  @Get('/games/open')
  findAllOpen() {
    return this.gamesService.findAllOpen();
  }

  @ApiResponse({
    status: 200,
    description: 'Game fetch successfully',
    type: GameResponseDto,
  })
  @ApiOperation({ summary: 'Get a game by id' })
  @ApiParam({ name: 'id', type: String })
  @Get('/game/:id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @Get('/games/user-created-games')
  @ApiOperation({ summary: 'Get all games created by a specific user' })
  @ApiResponse({
    status: 200,
    description: 'Games created by the user',
    type: [GameResponseDto],
  })
  findGamesByUser(@UserPayload() user: User) {
    return this.gamesService.findGamesCreatedByUser(user);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @Get('/games/user-joined')
  @ApiOperation({ summary: 'Get all games a user has joined' })
  @ApiResponse({
    status: 200,
    description: 'Games joined by user',
    type: [GameResponseDto],
  })
  getJoinedGames(@UserPayload() user: User) {
    return this.gamesService.getJoinedGames(user);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Submit bets' })
  @Post('/submit-bets')
  predictGame(@Body() body: BulkCreateBetsDto, @UserPayload() user: User) {
    return this.gamesService.submitBets(user, body);
  }

  // @ApiSecurity('x-para-session')
  // @UseGuards(SessionAuthGuard)
  // @Post('/game/join/:id')
  // @ApiOperation({ summary: 'Join a game' })
  // @ApiParam({ name: 'id', type: String })
  // @ApiQuery({
  //   name: 'gameCode',
  //   required: false,
  //   type: String,
  //   description: 'Game code if required',
  // })
  // @ApiResponse({
  //   status: 200,
  //   type: GameResponseDto,
  // })
  // joinGame(
  //   @Param('id') id: string,
  //   @Query('gameCode') gameCode: string,
  //   @UserPayload() user: User,
  // ) {
  //   return this.gamesService.joinGame(user, id, gameCode);
  // }

  @ApiOperation({ summary: 'Get a game using its unique code' })
  @ApiResponse({
    status: 200,
    type: GameResponseDto,
  })
  @ApiParam({ name: 'code', type: String })
  @Get('/game/code/:code')
  findByGameCode(@Param('code') code: string) {
    return this.gamesService.findByGameCode(code);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Update a game' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Game updated successfully',
    type: GameResponseDto,
  })
  @Patch('/game/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
    @UserPayload() user: User,
  ) {
    return this.gamesService.update(id, updateGameDto, user);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Update a game' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Game updated successfully',
    type: GameResponseDto,
  })
  @Patch('/game/resolve/:id')
  resolve(@Param('id') id: string) {
    return this.gamesService.resolveGame(id);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a game' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Game deleted successfully' })
  @Delete('/game/delete/:id')
  remove(@Param('id') id: string, @UserPayload() user: User) {
    return this.gamesService.remove(id, user);
  }
}
