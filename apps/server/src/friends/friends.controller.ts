import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { UserPayload } from 'src/auth/auth.user.decorator';
import { User } from 'src/user/dto/user-response.dto';
import { FriendsService } from './friends.service';
import { Friend } from './dto/friend.dto';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Toggle follow' })
  @ApiResponse({
    status: 200,
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    type: String,
    description: 'User ID to follow/unfollow',
  })
  @Post('toggle')
  async toggleFollow(
    @Query('userId') userId: string,
    @UserPayload() currentUser: User,
  ) {
    return this.friendsService.toggleFollow(currentUser.id, userId);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get followers' })
  @ApiResponse({
    status: 200,
    description: 'Get all my followers',
    type: [Friend],
  })
  @Get('followers')
  async getFollowers(@UserPayload() user: User) {
    return this.friendsService.getFollowers(user.id);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get followers' })
  @ApiResponse({
    status: 200,
    description: 'Get all friends following me',
    type: [Friend],
  })
  @Get('following')
  async getFollowing(@UserPayload() user: User) {
    return this.friendsService.getFollowing(user.id);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiResponse({
    status: 200,
  })
  @ApiParam({ name: 'userId', type: String })
  @ApiOperation({ summary: 'Check if user is following' })
  @Get('is-following/:userId')
  async isFollowing(
    @Param('userId') userId: string,
    @UserPayload() currentUser: User,
  ) {
    const following = await this.friendsService.isFollowing(currentUser.id, userId);
    return { isFollowing: following };
  }
}
