import { Global, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { PrismaService } from './service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule implements OnModuleInit, OnModuleDestroy {
  public constructor(private readonly prismaService: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.prismaService.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.prismaService.$disconnect();
  }
}

export { PrismaService };
