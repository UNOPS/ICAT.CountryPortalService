import { Module } from '@nestjs/common';
import { AssessmentApplicabilityController } from './assessment-applicability.controller';
import { AssessmentApplicabilityService } from './assessment-applicability.service';

@Module({
  controllers: [AssessmentApplicabilityController],
  providers: [AssessmentApplicabilityService],
})
export class AssessmentApplicabilityModule {}
