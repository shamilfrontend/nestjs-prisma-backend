import { BadRequestException } from '@nestjs/common';

export class IncorrectCodeException extends BadRequestException {
  constructor() {
    super({
      code: 'incorrect_code',
      message: 'Неверный код'
    });
  }
}
