import { GamesService } from '../games/games.service';

export type GamesFindOne = Awaited<ReturnType<GamesService['findOne']>>;
