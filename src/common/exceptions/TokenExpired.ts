import { UnauthorizedException } from '@nestjs/common';

export class TokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      code: 'token_expired',
      message: 'Cрок действия авторизационного токена истек'
    });
  }
}
