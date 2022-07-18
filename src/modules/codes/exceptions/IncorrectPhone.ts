import { BadRequestException } from '@nestjs/common';

export class IncorrectPhoneException extends BadRequestException {
  constructor() {
    super({
      code: 'incorrect_phone',
      message: 'Передан некорректный номер телефона'
    });
  }
}
