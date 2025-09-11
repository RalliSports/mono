import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ReferralModule } from 'src/referral/referral.module';
import { AuthService } from './auth.service';
import { SessionAuthGuard } from './auth.session.guard';

@Module({
  imports: [DatabaseModule, forwardRef(() => ReferralModule)],
  providers: [AuthService, SessionAuthGuard],
  exports: [AuthService, SessionAuthGuard],
})
export class AuthModule {}
