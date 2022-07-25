import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenDetails } from 'src/utills/token_details';
import { LearningMaterial } from './entity/learning-material.entity';
import { LearningMaterialController } from './learning-material.controller';
import { LearningMaterialService } from './learning-material.service';

@Module({
  imports: [TypeOrmModule.forFeature([LearningMaterial])],
  controllers: [LearningMaterialController],
  providers: [LearningMaterialService,TokenDetails],
  exports: [LearningMaterialService],
})
export class LearningMaterialModule {}
