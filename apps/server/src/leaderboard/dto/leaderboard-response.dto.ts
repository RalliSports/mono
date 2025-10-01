import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardUserDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'User avatar URL' })
  avatar: string;

  @ApiProperty({ description: 'Total games played' })
  gamesPlayed: number;

  @ApiProperty({ description: 'Total games won' })
  gamesWon: number;

  @ApiProperty({ description: 'Win percentage' })
  winPercentage: number;

  @ApiProperty({ description: 'Total amount won' })
  totalAmountWon: number;

  @ApiProperty({ description: 'Total amount deposited' })
  totalAmountDeposited: number;

  @ApiProperty({ description: 'Net profit/loss' })
  netProfit: number;

  @ApiProperty({ description: 'Current leaderboard rank' })
  rank: number;

  @ApiProperty({ description: 'Total correct bets' })
  totalCorrectBets: number;

  @ApiProperty({ description: 'Total bets placed' })
  totalBets: number;

  @ApiProperty({ description: 'Betting accuracy percentage' })
  bettingAccuracy: number;
}

export class LeaderboardResponseDto {
  @ApiProperty({
    description: 'List of users in leaderboard order',
    type: [LeaderboardUserDto],
  })
  users: LeaderboardUserDto[];

  @ApiProperty({ description: 'Total number of users' })
  totalUsers: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of users per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}
