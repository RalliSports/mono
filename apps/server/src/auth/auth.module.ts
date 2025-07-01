import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionAuthGuard } from './auth.session.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [AuthService, SessionAuthGuard],
  exports: [AuthService, SessionAuthGuard],
})
export class AuthModule {}
