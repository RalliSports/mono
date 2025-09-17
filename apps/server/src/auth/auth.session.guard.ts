import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service'; // You'll implement this

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const sessionId = req.headers['x-para-session'];
    const referralCode = req.headers['x-referral-code'];
    const email = req.headers['x-email'];

    if (!sessionId || typeof sessionId !== 'string') {
      throw new UnauthorizedException('Session ID missing');
    }

    const user = await this.authService.validateSession(
      sessionId,
      typeof email === 'string' ? email : undefined,
      typeof referralCode === 'string' ? referralCode : undefined,
    );

    req.user = user;
    return true;
  }
}

// @Injectable()
// export class AdminRoleGuard implements CanActivate {
//   constructor(private readonly authService: AuthService) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const req = context.switchToHttp().getRequest();
//     const sessionId = req.headers['x-para-session'];

//     if (!sessionId || typeof sessionId !== 'string') {
//       throw new UnauthorizedException('Session ID missing');
//     }

//     const user = await this.authService.validateSession(sessionId);
//     // if (user.role?.type !== 'admin') {
//     //   throw new ForbiddenException('Admin role required');
//     // }
//     req.user = user;
//     return true;
//   }
// }
