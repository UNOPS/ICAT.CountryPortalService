import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaActionHistoryController } from './ca-action-history.controller';
import { CaActionHistoryService } from './ca-action-history.service';
import { CaActionHistory } from './entity/ca-action-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CaActionHistory])],
  controllers: [CaActionHistoryController],
  providers: [CaActionHistoryService],
  exports: [CaActionHistoryService],
})
export class CaActionHistoryModule {}
