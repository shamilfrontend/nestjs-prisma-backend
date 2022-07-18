import { Module, HttpModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersController } from './interface/controller';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({ secret: process.env.JWT_SECRET_KEY })
  ],
  controllers: [UsersController],
})
export class UsersModule {}
