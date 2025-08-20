import { GamesService } from '../games/games.service';

export type GameWithRelations = Awaited<ReturnType<GamesService['findOne']>>;
