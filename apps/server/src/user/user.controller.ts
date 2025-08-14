import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPayload } from 'src/auth/auth.user.decorator';
import { User } from './dto/user-response.dto';

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
  @UseGuards(SessionAuthGuard)
  @Post('faucet-tokens')
  faucetTokens(@UserPayload() user: User) {
    console.log('user', user);
    return this.userService.faucetTokens(user);
  }
}
