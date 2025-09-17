import { GamesService } from '../games/games.service';
import { UserService } from '../user/user.service';
import { LinesService } from '../lines/lines.service';
import { AthletesService } from '../athletes/athletes.service';
import { MatchupsService } from '../matchups/matchups.service';
import { StatsService } from '../stats/stats.service';
import { TeamService } from '../team/team.service';
import { ReferralService } from '../referral/referral.service';
import { FriendsService } from 'src/friends/friends.service';

// Games Service Types
export type GamesFindOne = Awaited<ReturnType<GamesService['findOne']>>;
export type GamesFindAll = Awaited<ReturnType<GamesService['findAll']>>;
export type GamesFindAllOpen = Awaited<ReturnType<GamesService['findAllOpen']>>;
export type GamesCreate = Awaited<ReturnType<GamesService['create']>>;
export type GamesUpdate = Awaited<ReturnType<GamesService['update']>>;
export type GamesSubmitBets = Awaited<ReturnType<GamesService['submitBets']>>;
export type GamesFindByGameCode = Awaited<
  ReturnType<GamesService['findByGameCode']>
>;
export type GamesGetJoinedGames = Awaited<
  ReturnType<GamesService['getJoinedGames']>
>;
export type GamesGetMyOpenGames = Awaited<
  ReturnType<GamesService['getMyOpenGames']>
>;
export type GamesGetMyCompletedGames = Awaited<
  ReturnType<GamesService['getMyCompletedGames']>
>;
export type GamesResolveGame = Awaited<ReturnType<GamesService['resolveGame']>>;
export type GamesFindAllInstance = GamesFindAll[number];
export type GamesFindAllOpenInstance = GamesFindAllOpen[number];
export type GamesGetJoinedGamesInstance = GamesGetJoinedGames[number];
export type GamesGetMyOpenGamesInstance = GamesGetMyOpenGames[number];

// User Service Types
export type UserFindOne = Awaited<ReturnType<UserService['findOne']>>;
export type UserUpdate = Awaited<ReturnType<UserService['updateUser']>>;
export type UserFaucetTokens = Awaited<ReturnType<UserService['faucetTokens']>>;

export type FriendsFollowing = Awaited<ReturnType<FriendsService['getFollowing']>>;
export type FriendsFollower= Awaited<ReturnType<FriendsService['getFollowers']>>;

// Lines Service Types
export type LineFindAll = Awaited<ReturnType<LinesService['getAllLines']>>;
export type LineCreate = Awaited<ReturnType<LinesService['createLine']>>;
export type LineFindById = Awaited<ReturnType<LinesService['getLineById']>>;
export type LineUpdate = Awaited<ReturnType<LinesService['updateLine']>>;
export type LineResolve = Awaited<ReturnType<LinesService['resolveLine']>>;
export type LineFindAllInstance = LineFindAll[number];

// Athletes Service Types
export type AthletesFindAll = Awaited<
  ReturnType<AthletesService['getAllAthletes']>
>;
export type AthletesGetActiveWithUnresolvedLines = Awaited<
  ReturnType<AthletesService['getActiveAthletesWithUnresolvedLines']>
>;
export type AthletesCreate = Awaited<
  ReturnType<AthletesService['createAthlete']>
>;
export type AthletesFindOne = Awaited<
  ReturnType<AthletesService['getAthlete']>
>;
export type AthletesFindAllInstance = AthletesFindAll[number];
export type AthletesGetActiveWithUnresolvedLinesInstance =
  AthletesGetActiveWithUnresolvedLines[number];

// Matchups Service Types
export type MatchupsFindAll = Awaited<
  ReturnType<MatchupsService['getAllMatchups']>
>;
export type MatchupsFindById = Awaited<
  ReturnType<MatchupsService['getMatchupById']>
>;
export type MatchupsGetThatShouldHaveStarted = Awaited<
  ReturnType<MatchupsService['getMatchupsThatShouldHaveStarted']>
>;
export type MatchupsCreate = Awaited<
  ReturnType<MatchupsService['createMatchup']>
>;
export type MatchupCreateLinesForMatchup = Awaited<
  ReturnType<MatchupsService['createLinesForMatchup']>
>;
export type MatchupsUpdate = Awaited<
  ReturnType<MatchupsService['updateMatchup']>
>;
export type MatchupsFindAllInstance = MatchupsFindAll[number];
export type MatchupsGetThatShouldHaveStartedInstance =
  MatchupsGetThatShouldHaveStarted[number];

// Stats Service Types
export type StatsFindAll = Awaited<ReturnType<StatsService['getAllStats']>>;
export type StatsFindById = Awaited<ReturnType<StatsService['getStatById']>>;
export type StatsCreate = Awaited<ReturnType<StatsService['createStat']>>;
export type StatsFindAllInstance = StatsFindAll[number];

// Team Service Types
export type TeamCreate = Awaited<ReturnType<TeamService['create']>>;
export type TeamFindOne = Awaited<ReturnType<TeamService['findOne']>>;
export type TeamGetAthletesForTeam = Awaited<
  ReturnType<TeamService['getAthletesForTeam']>
>;
export type TeamGetOpenMatchupsForTeam = Awaited<
  ReturnType<TeamService['getOpenMatchupsForTeam']>
>;
export type TeamUpdate = Awaited<ReturnType<TeamService['update']>>;
export type TeamGetAll = Awaited<ReturnType<TeamService['getAllTeams']>>;
export type TeamGetAllInstance = TeamGetAll[number];
export type TeamGetAthletesForTeamInstance = TeamGetAthletesForTeam[number];
export type TeamGetOpenMatchupsForTeamInstance =
  TeamGetOpenMatchupsForTeam[number];

// Referral Service Types
export type ReferralGenerateCode = Awaited<
  ReturnType<ReferralService['generateReferralCode']>
>;
export type ReferralFindAllReferredUsers = Awaited<
  ReturnType<ReferralService['findAllReferredUsers']>
>;
export type ReferralFetchUserCode = Awaited<
  ReturnType<ReferralService['fetchUserReferralCode']>
>;
export type ReferralApplyCode = Awaited<
  ReturnType<ReferralService['applyReferralCode']>
>;
export type ReferralFindAllReferredUsersInstance =
  ReferralFindAllReferredUsers[number];
