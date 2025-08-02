import {
  CanActivate,
  ExecutionContext,
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

    if (!sessionId || typeof sessionId !== 'string') {
      throw new UnauthorizedException('Session ID missing');
    }

    const user = await this.authService.validateSession(sessionId);

    req.user = user;
    return true;
  }
}
