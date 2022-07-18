import { Module, HttpModule } from '@nestjs/common';

import { CodesController } from './interface/controller';

@Module({
  imports: [HttpModule],
  controllers: [CodesController]
})
export class CodesModule {}
