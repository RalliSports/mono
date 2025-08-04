import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { ReferralService } from './referral.service';
import { Referral, ReferralCode } from './dto/referral.dto';
import { User } from 'src/user/dto/user-response.dto';
import { UserPayload } from 'src/auth/auth.user.decorator';

@Controller('')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Generate referral code' })
  @ApiResponse({
    status: 201,
    type: ReferralCode,
  })
  @Post('/referral/generate-referral-code')
  generateReferralCode(@UserPayload() user: User) {
    return this.referralService.generateReferralCode(user);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Apply referral code' })
  @ApiResponse({
    status: 201,
    type: Referral,
  })
  @Post('/referral/apply-referral-code/:code')
  applyReferralCode(@Param('code') code: string, @UserPayload() user: User) {
    return this.referralService.applyReferralCode(code, user);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Referred users' })
  @ApiResponse({
    status: 200,
    type: [Referral],
  })
  @Get('/referral/referred-users')
  findAllReferredUsers(@UserPayload() user: User) {
    return this.referralService.findAllReferredUsers(user);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Fetch user referral code' })
  @ApiResponse({
    status: 200,
    type: ReferralCode,
  })
  @Get('/referral/fetch-referral-code')
  fetchUserReferralCode(@UserPayload() user: User) {
    return this.referralService.fetchUserReferralCode(user);
  }
}
