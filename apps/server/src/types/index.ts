import { GamesService } from 'src/games/games.service';

export type GameWithRelations = Awaited<ReturnType<GamesService['findOne']>>;
