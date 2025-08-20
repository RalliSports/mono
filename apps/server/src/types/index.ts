import { UserService } from 'src/user/user.service';
import { GamesService } from '../games/games.service';

export type GamesFindOne = Awaited<ReturnType<GamesService['findOne']>>;
export type GamesFindAll = Awaited<ReturnType<GamesService['findAll']>>;
export type GamesFindAllInstance = GamesFindAll[number];
export type UserFindOne = Awaited<ReturnType<UserService['findOne']>>;
