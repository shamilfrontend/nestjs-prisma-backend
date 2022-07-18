import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUser {
  userId: number;
  phone: string;
}

export const CurrentUser = createParamDecorator((_, context: ExecutionContext): CurrentUser => {
  const request = context.switchToHttp().getRequest();

  return {
    userId: request.currentUser.userId,
    phone: request.currentUser.phone
  };
})
