import ParaServer, { Environment } from '@getpara/server-sdk';
import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly paraServer: ParaServer;

  constructor() {
    this.paraServer = new ParaServer(
      Environment.BETA,
      process.env.PARA_API_KEY,
    );
  }

async validateSession(session: string): Promise<boolean> {
  try {
    await this.paraServer.importSession(session);
    const isActive = await this.paraServer.isSessionActive();

    if (!isActive) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Session expired',
      });
    }

    return isActive;
  } catch (error) {
    return false;
  }
}

  async getPara(): Promise<ParaServer> {
  
    return await this.paraServer;
  }
}
