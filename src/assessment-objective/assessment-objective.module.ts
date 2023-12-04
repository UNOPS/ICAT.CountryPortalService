import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentObjectiveController } from './assessment-objective.controller';
import { AssessmentObjectiveService } from './assessment-objective.service';
import { AssessmentObjective } from './entity/assessment-objective.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssessmentObjective])],
  controllers: [AssessmentObjectiveController],
  providers: [AssessmentObjectiveService],
  exports: [AssessmentObjectiveService],
})
export class AssessmentObjectiveModule {}
