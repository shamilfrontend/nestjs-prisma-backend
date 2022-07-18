import { UnauthorizedException } from '@nestjs/common';

export class TokenAuthenticateFailException extends UnauthorizedException {
  constructor() {
    super({
      code: 'token_invalid',
      message: 'Не удалось верифицировать авторизационный токен'
    });
  }
}
