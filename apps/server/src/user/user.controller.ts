import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { UserPayload } from 'src/auth/auth.user.decorator';
import { CreateWebpushDto } from '../notification/dto/webpush.dto';
import { SendNotificationDto } from './dto/send-notification.dto';
import { UpdateUserDto, UpdateUserEmailDto } from './dto/update-user.dto';
import { User } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @Get('current-user')
  @ApiResponse({
    status: 200,
    description: 'Current user',
    type: User,
  })
  findCurrentUser(@UserPayload() user: User) {
    return this.userService.findOne(user.id);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get all push subscriptions' })
  @ApiResponse({
    status: 200,
    description: 'List of all subscriptions',
  })
  @Get('user/subscriptions')
  getSubscriptions() {
    return this.userService.getAllSubscriptions();
  }

  @Get('user/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Update user data' })
  @ApiResponse({
    status: 200,
    description: 'Updated successfully',
    type: User,
  })
  @Patch('update-user')
  updateUser(@Body() dto: UpdateUserDto, @UserPayload() user: User) {
    return this.userService.updateUser(dto, user);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Update user data' })
  @ApiResponse({
    status: 200,
    description: 'Updated successfully',
    type: User,
  })
  @Patch('update-user-email')
  updateUserEmail(@Body() dto: UpdateUserEmailDto, @UserPayload() user: User) {
    return this.userService.updateUserEmail(dto, user);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @Post('faucet-tokens')
  faucetTokens(@UserPayload() user: User) {
    return this.userService.faucetTokens(user);
  }

  @ApiResponse({
    status: 200,
    description: 'test web push noftification',
  })
  @Post('test/webpush')
  testWebPush(@Body() dto: CreateWebpushDto) {
    return this.userService.testWebpushNotification(dto.payload);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Subscribe to webpush notification' })
  @ApiResponse({
    status: 200,
    description: 'success',
  })
  @Post('user/subscribe-webpush')
  subscribeToWebPushNotification(
    @Body() dto: CreateWebpushDto,
    @UserPayload() user: User,
  ) {
    return this.userService.subscribeToWebPushNotification(dto.payload, user);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Unsubscribe from webpush notification' })
  @ApiResponse({
    status: 200,
    description: 'success',
  })
  @Post('user/unsubscribe-webpush')
  unsubscribeFromWebPushNotification(@Body() dto: CreateWebpushDto) {
    return this.userService.unsubscribeFromWebPushNotification(dto.payload);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Send notification to specific user' })
  @ApiResponse({
    status: 200,
    description: 'Notification sent',
  })
  @Post('user/send-notification')
  sendNotification(@Body() dto: SendNotificationDto) {
    return this.userService.sendNotificationToUser(dto);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Send notification to all users' })
  @ApiResponse({
    status: 200,
    description: 'Notifications sent',
  })
  @Post('user/send-notification-all')
  sendNotificationToAll(@Body() dto: SendNotificationDto) {
    return this.userService.sendNotificationToAll(dto);
  }
}
