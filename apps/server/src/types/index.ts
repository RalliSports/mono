import { GamesService } from '../games/games.service';
import { UserService } from '../user/user.service';
import { LinesService } from '../lines/lines.service';

export type GamesFindOne = Awaited<ReturnType<GamesService['findOne']>>;
export type GamesFindAll = Awaited<ReturnType<GamesService['findAll']>>;
export type GamesFindAllInstance = GamesFindAll[number];
export type UserFindOne = Awaited<ReturnType<UserService['findOne']>>;
export type LineFindAll = Awaited<ReturnType<LinesService['getAllLines']>>;
export type LineFindAllInstance = LineFindAll[number];
