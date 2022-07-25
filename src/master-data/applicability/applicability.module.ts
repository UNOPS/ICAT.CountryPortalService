import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicabilityController } from './applicability.controller';
import { ApplicabilityService } from './applicability.service';
import { ApplicabilityEntity } from './entity/applicability.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicabilityEntity])],
  controllers: [ApplicabilityController],
  providers: [ApplicabilityService],
  exports: [ApplicabilityService],
})
export class ApplicabilityModule {}
