import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { LeaderboardResponseDto } from './dto/leaderboard-response.dto';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @ApiOperation({ summary: 'Get leaderboard of users' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of users per page (default: 50, max: 100)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['winRate', 'totalWinnings', 'netProfit', 'bettingAccuracy'],
    description: 'Sort criteria (default: netProfit)',
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard retrieved successfully',
    type: LeaderboardResponseDto,
  })
  @Get()
  getLeaderboard(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy')
    sortBy?: 'winRate' | 'totalWinnings' | 'netProfit' | 'bettingAccuracy',
  ) {
    const pageNum = page ? Math.max(1, parseInt(page, 10)) : 1;
    const limitNum = limit
      ? Math.min(100, Math.max(1, parseInt(limit, 10)))
      : 50;
    const sortCriteria = sortBy || 'netProfit';

    return this.leaderboardService.getLeaderboard(
      pageNum,
      limitNum,
      sortCriteria,
    );
  }

  @ApiOperation({ summary: 'Get top performers across different categories' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of top users per category (default: 10, max: 50)',
  })
  @ApiResponse({
    status: 200,
    description: 'Top performers retrieved successfully',
  })
  @Get('top-performers')
  getTopPerformers(@Query('limit') limit?: string) {
    const limitNum = limit
      ? Math.min(50, Math.max(1, parseInt(limit, 10)))
      : 10;
    return this.leaderboardService.getTopPerformers(limitNum);
  }
}
