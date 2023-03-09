import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentApplicabilityService } from './assessment-applicability.service';

describe('AssessmentApplicabilityService', () => {
  let service: AssessmentApplicabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssessmentApplicabilityService],
    }).compile();

    service = module.get<AssessmentApplicabilityService>(
      AssessmentApplicabilityService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
