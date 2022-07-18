import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@/Prisma';

import { UsersModule } from '@/modules/users';
import { CodesModule } from '@/modules/codes';

@Module({
  imports: [
    ConfigModule.forRoot(),

    PrismaModule,

    UsersModule,
    CodesModule
  ],
})
export class AppModule {}
