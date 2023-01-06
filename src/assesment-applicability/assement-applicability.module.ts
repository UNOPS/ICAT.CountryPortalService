import { Module } from '@nestjs/common';
import { AssementApplicabilityController } from './assement-applicability.controller';
import { AssementApplicabilityService } from './assement-applicability.service';

@Module({
  controllers: [AssementApplicabilityController],
  providers: [AssementApplicabilityService]
})
export class AssementApplicabilityModule {}
