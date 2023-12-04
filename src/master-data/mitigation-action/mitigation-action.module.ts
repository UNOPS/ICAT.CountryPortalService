import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MitigationActionController } from './mitigation-action.controller';
import { MitigationActionType } from './mitigation-action.entity';
import { MitigationActionService } from './mitigation-action.service';

@Module({
  imports: [TypeOrmModule.forFeature([MitigationActionType])],
  providers: [MitigationActionService],
  controllers: [MitigationActionController],
  exports: [MitigationActionService],
})
export class MitigationActionModule {}
