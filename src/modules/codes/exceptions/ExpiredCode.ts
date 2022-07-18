import { BadRequestException } from '@nestjs/common';

export class ExpiredCodeException extends BadRequestException {
  constructor() {
    super({
      code: 'expired_code',
      message: 'Время действия кода истекло, запросите заново'
    });
  }
}
