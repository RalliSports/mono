import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserPayload } from 'src/auth/auth.user.decorator';
import { User } from './dto/user-response.dto';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(SessionAuthGuard)
  @Post('faucet-tokens')
  faucetTokens(@UserPayload() user: User) {
    console.log('user', user);
    return this.userService.faucetTokens(user);
  }
}
