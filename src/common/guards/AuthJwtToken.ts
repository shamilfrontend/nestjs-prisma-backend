import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CurrentUser } from '@/common/decorators/currentUser';
import { TokenExpiredException } from '@/common/exceptions/TokenExpired';
import { TokenAuthenticateFailException } from '@/common/exceptions/TokenAuthenticateFail';

interface JWTDecoded {
  userId: number;
  phone: string;
}

@Injectable()
export class AuthJwtTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let currentUser: CurrentUser;

    const request = context.switchToHttp().getRequest();

    if (!request) return false;

    currentUser = await this.validateToken(request.headers.authorization);
    request.currentUser = currentUser;
    return true
  }

  async validateToken(authorization: string): Promise<CurrentUser> {
    const [tokenType, token] = authorization?.split(' ') ?? [];

    if (tokenType !== 'Bearer') throw new TokenAuthenticateFailException();

    try {
      const { userId, phone } = await this.jwtService.verifyAsync<JWTDecoded>(token);

      return {
        userId,
        phone
      };
    } catch ({ name }) {
      if (name === 'TokenExpiredError') throw new TokenExpiredException();

      throw new TokenAuthenticateFailException();
    }
  }
}
