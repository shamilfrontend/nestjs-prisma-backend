import { ConflictException } from '@nestjs/common';

export class UserExistsException extends ConflictException {
  constructor() {
    super({
      code: 'user_exists',
      message: 'Пользователь с таким телефоном уже зарегистрирован'
    });
  }
}
