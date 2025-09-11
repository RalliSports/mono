import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { UserPayload } from 'src/auth/auth.user.decorator';
import { User } from 'src/user/dto/user-response.dto';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Toggle follow' })
  @ApiResponse({
    status: 200,
    description: 'Follow/unflollow user',
  })
  @ApiParam({ name: 'userId', type: String })
  @Post('toggle')
  async toggleFollow(
    @Param('userId') userId: string,
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
  })
  @Get('followers')
  async getFollowers( @UserPayload() user: User) {
    return this.friendsService.getFollowers(user.id);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get followers' })
  @ApiResponse({
    status: 200,
    description: 'Get all friends following me',
  })
  @Get('following')
  async getFollowing(@UserPayload() user: User) {
    return this.friendsService.getFollowing(user.id);
  }
}
