import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { SessionAuthGuard } from 'src/auth/auth.session.guard';
import { UserPayload } from 'src/auth/auth.user.decorator';
import { User, User as UserType } from 'src/user/dto/user-response.dto';

@Controller('referral')
@UseGuards(SessionAuthGuard)
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('code')
  async getReferralCode(@UserPayload() user: UserType) {
    const code = await this.referralService.getReferralCode(user.id);
    if (!code) {
      // Generate a new code if user doesn't have one
      const newCode = await this.referralService.generateReferralCode(user.id);
      return { code: newCode };
    }
    return { code };
  }

  @Post('generate')
  async generateReferralCode(@UserPayload() user: UserType) {
    const code = await this.referralService.generateReferralCode(user.id);
    return { code };
  }

  @Get('stats')
  async getReferralStats(@UserPayload() user: UserType) {
    return await this.referralService.getReferralStats(user.id);
  }

  @Post('validate')
  async validateReferralCode(@Body() body: { code: string }) {
    const isValid = this.referralService.isValidReferralCode(body.code);
    return { isValid };
  }

  @Get('referred-users')
  async getReferredUsers(@UserPayload() user: UserType) {
    return await this.referralService.findAllReferredUsers(user.id);
  }
}
