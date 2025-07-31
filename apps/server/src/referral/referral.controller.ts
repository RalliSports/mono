import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { ReferralService } from './referral.service';
import { Referral, ReferralCode } from './dto/referral.dto';

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
  generateReferralCode() {
    return this.referralService.generateReferralCode();
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Apply referral code' })
  @ApiResponse({
    status: 201,
    type: Referral,
  })
  @Post('/referral/apply-referral-code/:code')
  applyReferralCode(@Param('code') code: string) {
    return this.referralService.applyReferralCode(code);
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Referred users' })
  @ApiResponse({
    status: 200,
    type: [Referral],
  })
  @Get('/referral/referred-users')
  findAllReferredUsers() {
    return this.referralService.findAllReferredUsers();
  }

  @ApiSecurity('x-para-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Fetch user referral code' })
  @ApiResponse({
    status: 200,
    type: ReferralCode,
  })
  @Get('/referral/fetch-referral-code')
  fetchUserReferralCode() {
    return this.referralService.fetchUserReferralCode();
  }
}
