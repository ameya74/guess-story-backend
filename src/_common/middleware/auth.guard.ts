import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  // eslint-disable-next-line no-useless-constructor, no-unused-vars, no-empty-function
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string;

    if (typeof authHeader === 'undefined')
      throw new BadRequestException('authorization header cannot empty');

    const authToken = authHeader.split(' ')[1];
    const { walletAddress } = await this.jwtService
      .verifyAsync(authToken)
      .catch((err) => {
        throw new BadRequestException(
          `jwt verification failed: ${err.message}`,
        );
      });
    const _walletAddress = walletAddress.toLowerCase();

    request.walletAddress = _walletAddress;

    return Promise.resolve(true);
  }
}
