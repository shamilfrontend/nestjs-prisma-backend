import { BadRequestException } from '@nestjs/common';

export class UserDoesNotFoundException extends BadRequestException {
  constructor() {
    super({
      code: 'user_does_not_found',
      message: 'Пользователь не найден'
    });
  }
}
